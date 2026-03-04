
export function hasAnyRole(rolesToCheck: string[]): boolean {
  try {

    const userRolesString = localStorage.getItem('userRoles');
    if (!userRolesString) return false;
    
    const userRoles: string[] = JSON.parse(userRolesString);

    return rolesToCheck.some(role => userRoles.includes(role));
  } 
  catch (error) 
  {
    console.error('Ошибка при проверке ролей:', error);
    return false;
  }
}

export const STUDENT = "STUDENT";
export const TEACHER = "TEACHER";
export const MANAGER = "MANAGER";
