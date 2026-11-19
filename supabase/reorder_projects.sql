-- Apply in Supabase SQL Editor. Reordering runs as one transaction inside this function.
create or replace function public.reorder_projects(project_order jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    requested_count integer;
    matched_count integer;
    total_projects integer;
    temporary_offset bigint;
begin
    if auth.uid() is null
       or lower(coalesce(auth.jwt() ->> 'email', '')) <> 'absyalsatria20@gmail.com' then
        raise exception 'Admin access required';
    end if;

    if project_order is null or jsonb_typeof(project_order) is distinct from 'array' then
        raise exception 'project_order must be a JSON array';
    end if;

    select count(*) into requested_count
    from jsonb_to_recordset(project_order) as item(id bigint, sort_order integer);

    if requested_count <> jsonb_array_length(project_order) then
        raise exception 'Invalid project_order entries';
    end if;

    if exists (
        select 1
        from jsonb_to_recordset(project_order) as item(id bigint, sort_order integer)
        where item.id is null or item.sort_order is null or item.sort_order < 1
    ) then
        raise exception 'Project IDs and positive sort_order values are required';
    end if;

    if exists (
        select id from jsonb_to_recordset(project_order) as item(id bigint, sort_order integer)
        group by id having count(*) > 1
    ) then
        raise exception 'Duplicate project IDs are not allowed';
    end if;

    if exists (
        select sort_order from jsonb_to_recordset(project_order) as item(id bigint, sort_order integer)
        group by sort_order having count(*) > 1
    ) then
        raise exception 'Duplicate sort_order values are not allowed';
    end if;

    lock table public.projects in share row exclusive mode;

    select count(*) into total_projects from public.projects;
    if requested_count <> total_projects then
        raise exception 'Project list changed; reload before reordering';
    end if;

    if exists (
        select project.id
        from public.projects as project
        where not exists (
            select 1
            from jsonb_to_recordset(project_order) as item(id bigint, sort_order integer)
            where item.id = project.id
        )
    ) then
        raise exception 'Project list changed; reload before reordering';
    end if;

    select coalesce(max(sort_order)::bigint, 0) + requested_count + 1
    into temporary_offset
    from public.projects;

    if temporary_offset + coalesce((select max(sort_order)::bigint from public.projects), 0) > 2147483647 then
        raise exception 'Temporary sort_order exceeds supported integer range';
    end if;

    update public.projects
    set sort_order = (sort_order::bigint + temporary_offset)::integer;

    update public.projects as project
    set sort_order = item.sort_order
    from jsonb_to_recordset(project_order) as item(id bigint, sort_order integer)
    where project.id = item.id;

    get diagnostics matched_count = row_count;
    if matched_count <> requested_count then
        raise exception 'Some project IDs no longer exist';
    end if;
end;
$$;

revoke all on function public.reorder_projects(jsonb) from public, anon;
grant execute on function public.reorder_projects(jsonb) to authenticated;
