document.addEventListener('DOMContentLoaded', function() {
    const submitTeamButton = document.getElementById('add-team');
    const showTeamsButton = document.getElementById('show-teams');
    const teamsContainer = document.getElementById('teams-container');
    const maleAthletesSelect = document.querySelectorAll('select[data-gender="male"]');
    const femaleAthletesSelect = document.querySelectorAll('select[data-gender="female"]');

    let selectedMaleTeam = {};
    let selectedFemaleTeam = {};
    let teams = JSON.parse(localStorage.getItem('teams')) || [];

    function addAthleteToTeam(gender, specialty, athleteName) {
        let selectedTeam = gender === 'male' ? selectedMaleTeam : selectedFemaleTeam;

        if (selectedTeam[specialty]) {
            const previousAthlete = selectedTeam[specialty].name;
            alert(`${previousAthlete} è stato svincolato dalla specialità ${specialty}.`);
        }

        selectedTeam[specialty] = { name: athleteName };
        updateSubmitButton();
    }

    function handleAthleteSelection(event) {
        const selectElement = event.target;
        const specialty = selectElement.dataset.specialty;
        const athleteName = selectElement.value;

        if (athleteName) {
            const gender = selectElement.dataset.gender;
            addAthleteToTeam(gender, specialty, athleteName);
        }
    }

    maleAthletesSelect.forEach(select => {
        select.addEventListener('change', handleAthleteSelection);
    });

    femaleAthletesSelect.forEach(select => {
        select.addEventListener('change', handleAthleteSelection);
    });

    function validateSelection() {
        const specialties = [
            "100 metri", "200 metri", "400 metri", "800 metri", "1500 metri", 
            "5000 metri", "10000 metri", "Maratona", "110 hs", "400 hs", 
            "3000 metri sc", "Salto in alto", "Salto in lungo", "Salto con l'asta", 
            "Salto triplo", "Giavellotto", "Peso", "Disco", "Martello", "Decathlon",
            "20 Km marcia", "4x100", "4x400"
        ];

        const missingMaleSpecialties = specialties.filter(s => !selectedMaleTeam[s]);
        const missingFemaleSpecialties = specialties.filter(s => !selectedFemaleTeam[s]);

        if (missingMaleSpecialties.length > 0 || missingFemaleSpecialties.length > 0) {
            let alertMessage = '';
            if (missingMaleSpecialties.length > 0) {
                alertMessage += 'Per gli uomini, manca la selezione delle seguenti specialità: ' + missingMaleSpecialties.join(', ') + '.\n';
            }
            if (missingFemaleSpecialties.length > 0) {
                alertMessage += 'Per le donne, manca la selezione delle seguenti specialità: ' + missingFemaleSpecialties.join(', ') + '.';
            }
            alert(alertMessage);
            return false;
        }
        return true;
    }

    function updateSubmitButton() {
        const specialties = [
            "100 metri", "200 metri", "400 metri", "800 metri", "1500 metri", 
            "5000 metri", "10000 metri", "Maratona", "110 hs", "400 hs", 
            "3000 metri sc", "Salto in alto", "Salto in lungo", "Salto con l'asta", 
            "Salto triplo", "Giavellotto", "Peso", "Disco", "Martello", "Decathlon",
            "20 Km marcia", "4x100", "4x400"
        ];

        const maleComplete = specialties.every(s => selectedMaleTeam[s]);
        const femaleComplete = specialties.every(s => selectedFemaleTeam[s]);
        submitTeamButton.disabled = !(maleComplete && femaleComplete);
    }

    function resetForm() {
        document.getElementById('team-name').value = '';
        document.getElementById('capitano-maschile').value = '';
        document.getElementById('capitano-femminile').value = '';

        maleAthletesSelect.forEach(select => select.value = '');
        femaleAthletesSelect.forEach(select => select.value = '');

        selectedMaleTeam = {};
        selectedFemaleTeam = {};
        updateSubmitButton();
    }

    function saveTeams() {
        localStorage.setItem('teams', JSON.stringify(teams));
    }

    function displayTeams() {
        teamsContainer.innerHTML = '';

        teams.forEach((team, index) => {
            teamsContainer.innerHTML += `
                <div class="team-entry">
                    <h3>${team.name}</h3>
                    <p>Capitano Maschile: ${team.maleCaptain}</p>
                    <p>Capitano Femminile: ${team.femaleCaptain}</p>
                    <h4>Atleti Maschili:</h4>
                    ${Object.keys(team.maleTeam).map(specialty => `
                        <h5>${specialty}</h5>
                        <ul>
                            ${team.maleTeam[specialty].name ? `<li>${team.maleTeam[specialty].name}</li>` : ''}
                        </ul>
                    `).join('')}
                    <h4>Atleti Femminili:</h4>
                    ${Object.keys(team.femaleTeam).map(specialty => `
                        <h5>${specialty}</h5>
                        <ul>
                            ${team.femaleTeam[specialty].name ? `<li>${team.femaleTeam[specialty].name}</li>` : ''}
                        </ul>
                    `).join('')}
                    <button onclick="editTeam(${index})">Modifica</button>
                    <button onclick="deleteTeam(${index})">Elimina</button>
                </div>
            `;
        });
    }

    function editTeam(index) {
        const team = teams[index];
        
        document.getElementById('team-name').value = team.name;
        document.getElementById('capitano-maschile').value = team.maleCaptain;
        document.getElementById('capitano-femminile').value = team.femaleCaptain;
        
        Object.keys(team.maleTeam).forEach(specialty => {
            const athlete = team.maleTeam[specialty];
            maleAthletesSelect.forEach(select => {
                if (select.dataset.specialty === specialty) {
                    select.value = athlete.name;
                }
            });
        });
        
        Object.keys(team.femaleTeam).forEach(specialty => {
            const athlete = team.femaleTeam[specialty];
            femaleAthletesSelect.forEach(select => {
                if (select.dataset.specialty === specialty) {
                    select.value = athlete.name;
                }
            });
        });

        selectedMaleTeam = { ...team.maleTeam };
        selectedFemaleTeam = { ...team.femaleTeam };
        updateSubmitButton();
        submitTeamButton.textContent = 'Aggiorna Squadra';
        submitTeamButton.removeEventListener('click', addTeam);
        submitTeamButton.addEventListener('click', function updateTeam() {
            updateTeam(index);
        });
    }

    function updateTeam(index) {
        if (validateSelection()) {
            const name = document.getElementById('team-name').value;
            const maleCaptain = document.getElementById('capitano-maschile').value;
            const femaleCaptain = document.getElementById('capitano-femminile').value;

            if (!name || !maleCaptain || !femaleCaptain) {
                alert('Completa tutti i campi');
                return;
            }

            const team = teams[index];
            team.name = name;
            team.maleCaptain = maleCaptain;
            team.femaleCaptain = femaleCaptain;
            team.maleTeam = selectedMaleTeam;
            team.femaleTeam = selectedFemaleTeam;

            saveTeams();
            alert('Squadra aggiornata con successo!');
            resetForm();
            submitTeamButton.textContent = 'Aggiungi Squadra';
            submitTeamButton.removeEventListener('click', updateTeam);
            submitTeamButton.addEventListener('click', addTeam);
            displayTeams();
        }
    }

    function deleteTeam(index) {
        if (confirm('Sei sicuro di voler eliminare questa squadra?')) {
            teams.splice(index, 1);
            saveTeams();
            displayTeams();
        }
    }

    function addTeam() {
        if (validateSelection()) {
            const name = document.getElementById('team-name').value;
            const maleCaptain = document.getElementById('capitano-maschile').value;
            const femaleCaptain = document.getElementById('capitano-femminile').value;

            if (!name || !maleCaptain || !femaleCaptain) {
                alert('Completa tutti i campi');
                return;
            }

            if (teams.find(t => t.name === name)) {
                alert('Una squadra con questo nome esiste già');
                return;
            }

            const newTeam = {
                name,
                maleCaptain,
                femaleCaptain,
                maleTeam: selectedMaleTeam,
                femaleTeam: selectedFemaleTeam,
                malePoints: 0,
                femalePoints: 0
            };

            teams.push(newTeam);
            saveTeams();

            alert('Squadra aggiunta con successo!');
            resetForm();
            displayTeams();
        }
    }

    submitTeamButton.addEventListener('click', addTeam);
    showTeamsButton.addEventListener('click', displayTeams);

    document.getElementById('assign-points').addEventListener('click', function() {
        const athleteName = document.getElementById('athlete-name').value;
        const specialty = document.getElementById('specialty').value;
        const stage = document.getElementById('stage').value;
        const position = parseInt(document.getElementById('position').value);
        const isRecordNational = document.getElementById('record').checked;
        const isRecordContinental = document.getElementById('record-continental').checked;
        const isRecordChampionships = document.getElementById('record-championships').checked;
        const isRecordWorld = document.getElementById('record-world').checked;
        const isDNF = document.getElementById('dnf').checked;
        const isDQ = document.getElementById('dq').checked;

        if (!athleteName || !specialty) {
            alert('Completa tutti i campi');
            return;
        }

        const team = teams.find(t => (t.maleTeam[specialty] && t.maleTeam[specialty].name === athleteName) ||
                                      (t.femaleTeam[specialty] && t.femaleTeam[specialty].name === athleteName));

        if (!team) {
            alert('Atleta non trovato');
            return;
        }

        let points = 0;

        if (stage === 'Semifinale') {
            points = 1;
        } else if (stage === 'Finale') {
            points = position >= 1 && position <= 8 ? 21 - position : 0;
            if (position >= 9) {
                points = position === 10 ? 5 : position === 11 ? 4 : position === 12 ? 3 : 0;
            }
        }

        if (isDNF) {
            points -= 3;
            if (team.maleCaptain === athleteName || team.femaleCaptain === athleteName) {
                points -= 3;
            }
        }
        if (isDQ) {
            points -= 5;
            if (team.maleCaptain === athleteName || team.femaleCaptain === athleteName) {
                points -= 5;
            }
        }

        if (isRecordNational) points += 6;
        if (isRecordContinental) points += 9;
        if (isRecordChampionships) points += 12;
        if (isRecordWorld) points += 15;

        if (team.maleCaptain === athleteName || team.femaleCaptain === athleteName) {
            points *= 2;
        }

        if (team.maleTeam[specialty]) {
            const athlete = team.maleTeam[specialty];
            athlete.points = points;
        } else if (team.femaleTeam[specialty]) {
            const athlete = team.femaleTeam[specialty];
            athlete.points = points;
        }

        alert(`Punti assegnati: ${points}`);
    });

    updateSubmitButton();
});
