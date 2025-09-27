// Fetch hospital list from backend and populate dropdown
fetch('/hospitals')
    .then(res => res.json())
    .then(data => {
        const select = document.getElementById('hospital_id');
        select.innerHTML = '<option value="">Select Hospital</option>';
        data.forEach(h => {
            const option = document.createElement('option');
            option.value = h.id;
            option.textContent = h.name;
            select.appendChild(option);
        });
    })
    .catch(err => console.error('Failed to load hospitals:', err));
