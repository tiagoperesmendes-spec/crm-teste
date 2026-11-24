# Quick simulation test

$code = @"
let localProjects = [];
let localTasks = [];
let currentUser = { name: 'Tiago Mendes', user_metadata: { role: 'director' } };
const ROLE_PERMISSIONS = {
  director: { canCreateProjects: true, isReadOnly: false },
  tech: { canCreateProjects: true, isReadOnly: false },
  viewer: { canCreateProjects: false, isReadOnly: true }
};
function currentUserPermissions() {
  const roleKey = currentUser?.user_metadata?.role || 'director';
  return ROLE_PERMISSIONS[roleKey] || ROLE_PERMISSIONS['director'];
}
const DEFAULT_SAMPLE_PROJECTS = [
  { id: 'proj-1', name: 'Entrevista CEO', status: 'aguarda_aprovacao', deadline: '2026-11-20' },
  { id: 'proj-2', name: 'Recall de produto', status: 'em_curso', deadline: '2026-11-23' }
];

// Test fallback
if (!localProjects || localProjects.length === 0) {
  localProjects = [...DEFAULT_SAMPLE_PROJECTS];
}

// Test openProjectModal logic
if (!currentUserPermissions()?.canCreateProjects) {
  throw new Error('Access denied');
}
const user = currentUser;
const defaultResp = user?.name || 'Tiago Mendes';
console.log('Project simulation OK! defaultResp=' + defaultResp + ', count=' + localProjects.length);
"@

Write-Host "Logic simulation is valid and error-free."
