// Sample initial contacts
let contacts = [
    { id: 1, name: 'Mona Abdo', phone: '(202) 555-0101', email: 'mona@email.com', gender: 'female' },
    { id: 2, name: 'Karim Ali', phone: '(202) 555-0102', email: 'karim@email.com', gender: 'male' },
    { id: 3, name: 'Mohamed Hassan', phone: '(202) 555-0103', email: 'mohamed@email.com', gender: 'male' },
    { id: 4, name: 'Eman Ali', phone: '(202) 555-0104', email: 'eman@email.com', gender: 'female' }
];

let nextId = 5;
let currentContactId = null;
let editingContactId = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderContacts();
    setupSearchFilter();
});

function renderContacts(filter = '') {
    const contactList = document.getElementById('contactList');
    const filteredContacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(filter.toLowerCase()) ||
        contact.phone.includes(filter)
    );

    if (filteredContacts.length === 0) {
        contactList.innerHTML = '<div class="no-contacts">No contacts found</div>';
        return;
    }

    contactList.innerHTML = filteredContacts.map(contact => `
        <div class="contact-item" onclick="showContactDetail(${contact.id})">
            <div class="contact-avatar">${contact.name.charAt(0).toUpperCase()}</div>
            <div class="contact-info">
                <div class="contact-name">${contact.name}</div>
                <div class="contact-phone">${contact.phone}</div>
            </div>
            <div class="contact-actions" onclick="event.stopPropagation()">
                <button class="action-btn call-btn" onclick="callContactById(${contact.id})" title="Call">📞</button>
            </div>
        </div>
    `).join('');
}

function setupSearchFilter() {
    document.getElementById('searchInput').addEventListener('input', function(e) {
        renderContacts(e.target.value);
    });
}

function showContactList() {
    document.getElementById('listPanel').classList.remove('hidden');
    document.getElementById('detailPanel').classList.add('hidden');
    document.getElementById('formPanel').classList.add('hidden');
    currentContactId = null;
    editingContactId = null;
}

function showContactDetail(contactId) {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    currentContactId = contactId;

    document.getElementById('detailAvatar').textContent = contact.name.charAt(0).toUpperCase();
    document.getElementById('detailName').textContent = contact.name;
    document.getElementById('detailPhone').textContent = contact.phone;
    document.getElementById('detailEmail').textContent = contact.email || '-';
    document.getElementById('detailGender').textContent = contact.gender.charAt(0).toUpperCase() + contact.gender.slice(1);

    document.getElementById('listPanel').classList.add('hidden');
    document.getElementById('detailPanel').classList.remove('hidden');
    document.getElementById('formPanel').classList.add('hidden');
}

function showAddContact() {
    editingContactId = null;
    document.getElementById('formTitle').textContent = 'New Contact';
    document.getElementById('contactForm').reset();
    clearFormErrors();

    document.getElementById('listPanel').classList.add('hidden');
    document.getElementById('detailPanel').classList.add('hidden');
    document.getElementById('formPanel').classList.remove('hidden');
}

function editContactFromDetail() {
    if (!currentContactId) return;
    editContact(currentContactId);
}

function editContact(contactId) {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    editingContactId = contactId;
    document.getElementById('formTitle').textContent = 'Edit Contact';
    document.getElementById('nameInput').value = contact.name;
    document.getElementById('phoneInput').value = contact.phone;
    document.getElementById('emailInput').value = contact.email || '';
    document.querySelector(`input[name="gender"][value="${contact.gender}"]`).checked = true;
    clearFormErrors();

    document.getElementById('listPanel').classList.add('hidden');
    document.getElementById('detailPanel').classList.add('hidden');
    document.getElementById('formPanel').classList.remove('hidden');
}

function saveContact(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    const name = document.getElementById('nameInput').value.trim();
    const phone = document.getElementById('phoneInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const gender = document.querySelector('input[name="gender"]:checked').value;

    if (editingContactId) {
        // Update existing contact
        const contact = contacts.find(c => c.id === editingContactId);
        if (contact) {
            contact.name = name;
            contact.phone = phone;
            contact.email = email;
            contact.gender = gender;
        }
    } else {
        // Add new contact
        contacts.push({
            id: nextId++,
            name: name,
            phone: phone,
            email: email,
            gender: gender
        });
    }

    renderContacts();
    showContactList();
    document.getElementById('searchInput').value = '';
}

function validateForm() {
    let isValid = true;
    clearFormErrors();

    const name = document.getElementById('nameInput').value.trim();
    const phone = document.getElementById('phoneInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();

    if (name === '') {
        showError('nameInput', 'nameError', 'Name is required');
        isValid = false;
    }

    if (phone === '') {
        showError('phoneInput', 'phoneError', 'Phone number is required');
        isValid = false;
    } else if (!isValidPhone(phone)) {
        showError('phoneInput', 'phoneError', 'Please enter a valid phone number');
        isValid = false;
    }

    if (email !== '' && !isValidEmail(email)) {
        showError('emailInput', 'emailError', 'Please enter a valid email address');
        isValid = false;
    }

    return isValid;
}

function isValidPhone(phone) {
    // Basic phone validation - accepts various formats
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(inputId, errorId, message) {
    document.getElementById(inputId).classList.add('error');
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearFormErrors() {
    document.querySelectorAll('.form-input').forEach(input => {
        input.classList.remove('error');
    });
    document.querySelectorAll('.error-message').forEach(error => {
        error.classList.remove('show');
    });
}

function cancelForm() {
    showContactList();
}

function confirmDelete() {
    document.getElementById('deleteModal').classList.add('show');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('show');
}

function deleteContact() {
    if (currentContactId) {
        contacts = contacts.filter(c => c.id !== currentContactId);
        renderContacts();
        closeDeleteModal();
        showContactList();
        document.getElementById('searchInput').value = '';
    }
}

function callContact() {
    if (currentContactId) {
        const contact = contacts.find(c => c.id === currentContactId);
        if (contact) {
            alert(`📞 Calling ${contact.name}...\n${contact.phone}`);
        }
    }
}

function callContactById(contactId) {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
        alert(`📞 Calling ${contact.name}...\n${contact.phone}`);
    }
}
