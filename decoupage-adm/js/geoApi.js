export async function getRegions() {
    try {
        const response = await fetch('https://geo.api.gouv.fr/regions');
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des régions :', error);
        throw error;
    }
}

export async function getDepartmentsFromRegion(regionCode) {
    try {
        const response = await fetch(`https://geo.api.gouv.fr/regions/${regionCode}/departements`);
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des départements :', error);
        throw error;
    }
}

export async function getCitiesFromDepartment(departmentCode) {
    try {
        const response = await fetch(`https://geo.api.gouv.fr/departements/${departmentCode}/communes`);
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des villes :', error);
        throw error;
    }
}