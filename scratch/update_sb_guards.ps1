$filePath = "scratch/test_updated_dashboard.html"
$text = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

$oldTasksFetch = @"
        // Tarefas
        try {
          const { data: tasks, error } = await supabaseClient.from('tasks').select('*').order('due_date', { ascending: true });
          if (!error && tasks) {
            localTasks = tasks;
            localStorage.setItem('rep_tasks', JSON.stringify(tasks));
          }
        } catch (e) { }

        // Projetos
        try {
          const { data: projects, error } = await supabaseClient.from('projects').select('*').order('created_at', { ascending: false });
          if (!error && projects) {
            localProjects = projects;
            localStorage.setItem('rep_projects', JSON.stringify(projects));
          }
        } catch (e) { }
"@

$newTasksFetch = @"
        // Tarefas
        try {
          const { data: tasks, error } = await supabaseClient.from('tasks').select('*').order('due_date', { ascending: true });
          if (!error && tasks && tasks.length > 0) {
            localTasks = tasks;
            localStorage.setItem('rep_tasks', JSON.stringify(tasks));
          } else if (!localTasks || localTasks.length === 0) {
            localTasks = [...DEFAULT_SAMPLE_TASKS];
          }
        } catch (e) { }

        // Projetos
        try {
          const { data: projects, error } = await supabaseClient.from('projects').select('*').order('created_at', { ascending: false });
          if (!error && projects && projects.length > 0) {
            localProjects = projects;
            localStorage.setItem('rep_projects', JSON.stringify(projects));
          } else if (!localProjects || localProjects.length === 0) {
            localProjects = [...DEFAULT_SAMPLE_PROJECTS];
          }
        } catch (e) { }
"@

$text = $text.Replace($oldTasksFetch, $newTasksFetch)
[System.IO.File]::WriteAllText($filePath, $text, [System.Text.Encoding]::UTF8)
Write-Output "Successfully updated supabase tasks and projects guards!"
