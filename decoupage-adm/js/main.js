import { getRegions, getDepartmentsFromRegion, getCitiesFromDepartment } from './geoApi.js';

const regionsSelect = document.getElementById('regions');
const departementsSelect = document.getElementById('departements');
const showCommunesButton = document.getElementById('show-communes');
const communesList = document.getElementById('communes-list');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const regions = await getRegions();
        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region.code;
            option.textContent = region.nom;
            regionsSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des régions :', error);
    }
});

regionsSelect.addEventListener('change', async () => {
    const regionCode = regionsSelect.value;

    if (regionCode) {
        departementsSelect.disabled = false;
        departementsSelect.innerHTML = '<option value="">Sélectionnez un département</option>';

        try {
            const departements = await getDepartmentsFromRegion(regionCode);
            departements.forEach(departement => {
                const option = document.createElement('option');
                option.value = departement.code;
                option.textContent = departement.nom;
                departementsSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erreur lors du chargement des départements :', error);
        }
    } else {
        departementsSelect.disabled = true;
    }
});

showCommunesButton.addEventListener('click', async () => {
    const departmentCode = departementsSelect.value;

    if (departmentCode) {
        communesList.innerHTML = '';
        try {
            const communes = await getCitiesFromDepartment(departmentCode);
            communes.sort((a, b) => (b.population || 0) - (a.population || 0));
            communes.forEach(commune => {
                const li = document.createElement('li');
                li.textContent = `${commune.nom} (Population: ${commune.population || 'Non renseignée'})`;
                communesList.appendChild(li);
            });
        } catch (error) {
            console.error('Erreur lors du chargement des communes :', error);
        }
    }
});

departementsSelect.addEventListener('change', () => {
    showCommunesButton.disabled = !departementsSelect.value;
});