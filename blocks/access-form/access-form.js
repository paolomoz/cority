/*
 * access-form — gated resource access panel (D1 Marketo slot, form 1113).
 * Content rows: [cover image], [meta-rail text + h2]. The probed Marketo
 * field set is rendered as a real styled form; live wiring lands at launch
 * (data-dynamic="marketo-form" data-marketo-form-id="1113").
 */

const FIELD_PAIRS = [
  [
    {
      name: 'FirstName', label: 'First name', type: 'text', autocomplete: 'given-name',
    },
    {
      name: 'LastName', label: 'Last name', type: 'text', autocomplete: 'family-name',
    },
  ],
  [
    {
      name: 'Email', label: 'Work email', type: 'email', autocomplete: 'email',
    },
    {
      name: 'Company', label: 'Company', type: 'text', autocomplete: 'organization',
    },
  ],
  [
    {
      name: 'Phone', label: 'Phone', type: 'tel', autocomplete: 'tel',
    },
    {
      name: 'Title', label: 'Job title', type: 'text', autocomplete: 'organization-title',
    },
  ],
  [
    {
      name: 'Hear_about_Cority__c',
      label: 'How did you hear about Cority?',
      type: 'text',
      autocomplete: 'off',
    },
  ],
];

const INTERESTS = [
  'Sustainability',
  'Environmental',
  'Health',
  'Safety',
  'Quality',
  'Artificial intelligence',
];

function buildField({
  name, label, type, autocomplete,
}) {
  const fld = document.createElement('div');
  fld.className = 'fld';
  const lab = document.createElement('label');
  lab.setAttribute('for', `mk-${name}`);
  lab.append(`${label} `);
  const req = document.createElement('span');
  req.className = 'req';
  req.setAttribute('aria-hidden', 'true');
  req.textContent = '*';
  lab.append(req);
  const input = document.createElement('input');
  input.type = type;
  input.id = `mk-${name}`;
  input.name = name;
  input.required = true;
  input.autocomplete = autocomplete;
  fld.append(lab, input);
  return fld;
}

function buildForm() {
  const form = document.createElement('form');
  form.className = 'd1-form';
  form.method = 'post';
  form.action = '#';
  form.noValidate = true;
  form.dataset.dynamic = 'marketo-form';
  form.dataset.marketoFormId = '1113';

  FIELD_PAIRS.forEach((pair) => {
    if (pair.length === 1) {
      form.append(buildField(pair[0]));
      return;
    }
    const row = document.createElement('div');
    row.className = 'row';
    pair.forEach((f) => row.append(buildField(f)));
    form.append(row);
  });

  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');
  legend.textContent = 'I\'m interested in';
  const checks = document.createElement('div');
  checks.className = 'checks';
  INTERESTS.forEach((interest) => {
    const label = document.createElement('label');
    label.className = 'chk';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.name = `interest-${interest.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    label.append(box, interest);
    checks.append(label);
  });
  fieldset.append(legend, checks);

  const submit = document.createElement('button');
  submit.className = 'button primary';
  submit.type = 'submit';
  submit.textContent = 'Submit';

  const fineprint = document.createElement('p');
  fineprint.className = 'fineprint';
  fineprint.textContent = 'Form fields and consent handling connect to Marketo (form 1113) at launch.';

  form.append(fieldset, submit, fineprint);
  return form;
}

export default function decorate(block) {
  block.dataset.dynamic = 'marketo-form';
  block.dataset.marketoFormId = '1113';

  const cover = document.createElement('div');
  cover.className = 'cover';
  const pad = document.createElement('div');
  pad.className = 'pad';

  [...block.children].forEach((row) => {
    const img = row.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'eager');
      img.setAttribute('fetchpriority', 'high');
      cover.append(img);
    } else {
      const rail = row.querySelector('p');
      if (rail) rail.classList.add('meta-rail');
      const h2 = row.querySelector('h2');
      if (h2) block.setAttribute('aria-label', h2.textContent.trim());
      pad.append(...row.querySelectorAll('p, h2, h3'));
    }
    row.remove();
  });

  pad.append(buildForm());
  block.append(cover, pad);
}
