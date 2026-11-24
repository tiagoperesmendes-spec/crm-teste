    // Navegação para Detalhe de Projeto
    function openProjectDetail(id) {
      let proj = localProjects.find(p => p.id === id);
      if (!proj) proj = localProjects[0];
      if (!proj) return;
      activeProjectId = proj.id;
      switchView('project_detail', true, { projectId: proj.id });
      renderProjectDetail();
    }

    function openProjectDetailByName(name) {
      const proj = localProjects.find(p => p.name === name);
      if (proj) openProjectDetail(proj.id);
      else switchView('projects');
    }
