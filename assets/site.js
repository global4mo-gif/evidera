const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');

function closeMenu() {
  nav.classList.remove('is-open');
  menu.setAttribute('aria-expanded', 'false');
}

menu.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menu.setAttribute('aria-expanded', String(open));
});

nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

function openLinkedDetails() {
  const details = document.getElementById(location.hash.slice(1));
  if (details instanceof HTMLDetailsElement) details.open = true;
}

window.addEventListener('hashchange', openLinkedDetails);
openLinkedDetails();

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
    closeMenu();
    menu.focus();
  }
});

for (const form of document.querySelectorAll('[data-preview-form]')) {
  const status = form.querySelector('.form-status');
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = false;
  form.addEventListener('input', ({target}) => {
    if (target.validity) target.setCustomValidity('');
    if (target.name === 'method') form.elements.contact.setCustomValidity('');
    status.textContent = '';
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    for (const field of form.querySelectorAll('input[type="text"][required], textarea[required]')) {
      if (!field.value.trim()) {
        field.setCustomValidity('Заполните это поле.');
        field.reportValidity();
        return;
      }
    }

    if (form.dataset.previewForm === 'expert') {
      const method = form.elements.method.value;
      const contact = form.elements.contact;
      const value = contact.value.trim();
      const emailInvalid = method === 'Электронная почта' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const telephoneInvalid = method === 'Телефон' && !/^\+?[\d\s()-]{7,20}$/.test(value);
      if (emailInvalid || telephoneInvalid) {
        contact.setCustomValidity(emailInvalid ? 'Укажите электронную почту.' : 'Укажите номер телефона.');
        contact.reportValidity();
        return;
      }
    }

    status.textContent = 'Проверка пройдена. Анкета и тестовая отметка не отправлены.';
  });
}
