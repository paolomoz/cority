/*
 * util-form — styled STATIC form stubs for the T14 utility pages. No live
 * wiring; each variant renders the real probed field set as a real <form>
 * and marks the dynamic slot for launch integration.
 *
 * Variants (class on the block):
 *   demo      — Marketo form 1113 (get-a-demo). Field set + interest checkboxes
 *               traced from the live one.cority.com Marketo iframe probe.
 *               data-dynamic="marketo-form" data-marketo-form-id="1113".
 *   contact   — Marketo contact form (contact-us). Field set + Country/Industry/
 *               Reason selects traced from the live Marketo iframe probe.
 *               data-dynamic="marketo-form".
 *   subscribe — Elementor newsletter form (subscribe): single email + submit.
 *               data-dynamic="subscribe-form".
 *
 * Authored content rows supply the traceable copy (headings, intro, consent,
 * media). The consent paragraph (the one linking to the Privacy Policy) is
 * rendered as fine print under the submit button.
 */

const SPECS = {
  demo: {
    dynamic: 'marketo-form',
    marketoFormId: '1113',
    submit: 'Submit',
    pairs: [
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
          name: 'Hear_about_Cority__c', label: 'How did you hear about Cority?', type: 'text', autocomplete: 'off',
        },
      ],
    ],
    interests: {
      legend: 'What solutions are you interested in? (Choose all that apply)',
      options: ['Sustainability', 'Environmental', 'Health', 'Safety', 'Quality', 'Artificial intelligence'],
    },
  },
  contact: {
    dynamic: 'marketo-form',
    submit: 'Send',
    pairs: [
      [{
        name: 'FirstName', label: 'First name', type: 'text', autocomplete: 'given-name',
      }],
      [{
        name: 'LastName', label: 'Last name', type: 'text', autocomplete: 'family-name',
      }],
      [{
        name: 'Email', label: 'Email address', type: 'email', autocomplete: 'email',
      }],
      [{
        name: 'Phone', label: 'Phone', type: 'tel', autocomplete: 'tel',
      }],
      [{
        name: 'Company', label: 'Company', type: 'text', autocomplete: 'organization',
      }],
    ],
    selects: [
      // Country truncated to the pinned leads (live list is the full ISO set).
      { name: 'Country', label: 'Country', options: ['Select...', 'Canada', 'United States'] },
      {
        name: 'Industry',
        label: 'Industry',
        options: ['Select...', 'Aerospace', 'Automotive', 'Chemicals', 'Construction', 'Education', 'Energy & Utilities', 'Financial Services & Insurance', 'Food & Beverages', 'General Manufacturing', 'Government', 'High Tech Manufacturing', 'Hospitals & Clinics', 'Machinery', 'Medical Products', 'Mining & Metals', 'Oil & Gas', 'Pharmaceuticals & Biotechnology', 'Retail', 'Telecommunications', 'Transportation', 'Other'],
      },
      {
        name: 'Reason_for_Inquiry__c',
        label: 'Reason for Contact',
        options: ['Select...', 'Demo Request', 'Job Application', 'Media/Press', 'Event Related Inquiry', 'Sales Inquiry', 'Partnership Inquiry', 'Vendor Introduction', 'Request for Proposal', 'Business Case Development Support', 'Other'],
      },
    ],
    tail: [{
      name: 'Hear_about_Cority__c', label: 'How did you hear about Cority?', type: 'text', autocomplete: 'off',
    }],
  },
  subscribe: {
    dynamic: 'subscribe-form',
    submit: 'Submit',
    inline: true,
    pairs: [[{
      name: 'email', label: 'Email', type: 'email', autocomplete: 'email',
    }]],
  },
};

function buildField({
  name, label, type, autocomplete,
}) {
  const fld = document.createElement('div');
  fld.className = 'fld';
  const lab = document.createElement('label');
  lab.setAttribute('for', `uf-${name}`);
  lab.append(`${label} `);
  const req = document.createElement('span');
  req.className = 'req';
  req.setAttribute('aria-hidden', 'true');
  req.textContent = '*';
  lab.append(req);
  const input = document.createElement('input');
  input.type = type;
  input.id = `uf-${name}`;
  input.name = name;
  input.required = true;
  if (autocomplete) input.autocomplete = autocomplete;
  fld.append(lab, input);
  return fld;
}

function buildSelect({ name, label, options }) {
  const fld = document.createElement('div');
  fld.className = 'fld';
  const lab = document.createElement('label');
  lab.setAttribute('for', `uf-${name}`);
  lab.textContent = label;
  const select = document.createElement('select');
  select.id = `uf-${name}`;
  select.name = name;
  options.forEach((opt, i) => {
    const o = document.createElement('option');
    if (i === 0) o.value = '';
    o.textContent = opt;
    select.append(o);
  });
  fld.append(lab, select);
  return fld;
}

function buildForm(spec) {
  const form = document.createElement('form');
  form.className = 'uf-form';
  form.method = 'post';
  form.action = '#';
  form.noValidate = true;
  form.dataset.dynamic = spec.dynamic;
  if (spec.marketoFormId) form.dataset.marketoFormId = spec.marketoFormId;

  (spec.pairs || []).forEach((pair) => {
    if (pair.length === 1 && !spec.inline) {
      form.append(buildField(pair[0]));
      return;
    }
    if (spec.inline) {
      pair.forEach((f) => form.append(buildField(f)));
      return;
    }
    const row = document.createElement('div');
    row.className = 'row';
    pair.forEach((f) => row.append(buildField(f)));
    form.append(row);
  });

  (spec.selects || []).forEach((s) => form.append(buildSelect(s)));
  (spec.tail || []).forEach((f) => form.append(buildField(f)));

  if (spec.interests) {
    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = spec.interests.legend;
    const checks = document.createElement('div');
    checks.className = 'checks';
    spec.interests.options.forEach((interest) => {
      const label = document.createElement('label');
      label.className = 'chk';
      const box = document.createElement('input');
      box.type = 'checkbox';
      box.name = `interest-${interest.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      label.append(box, interest);
      checks.append(label);
    });
    fieldset.append(legend, checks);
    form.append(fieldset);
  }

  const submit = document.createElement('button');
  submit.className = 'button primary';
  submit.type = 'submit';
  submit.textContent = spec.submit;
  form.append(submit);
  return form;
}

export default function decorate(block) {
  const variant = ['demo', 'contact', 'subscribe'].find((v) => block.classList.contains(v)) || 'demo';
  const spec = SPECS[variant];

  block.dataset.dynamic = spec.dynamic;
  if (spec.marketoFormId) block.dataset.marketoFormId = spec.marketoFormId;

  // Gather authored copy + media from the rows.
  const heads = [];
  const intros = [];
  let consent = null;
  let media = null;
  [...block.children].forEach((row) => {
    const img = row.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'lazy');
      media = img;
    }
    [...row.querySelectorAll('h1, h2, h3')].forEach((h) => heads.push(h));
    [...row.querySelectorAll('p')].forEach((p) => {
      if (p.querySelector('a[href*="privacy"]')) consent = p;
      else if (p.textContent.trim()) intros.push(p);
    });
    row.remove();
  });

  const form = buildForm(spec);
  if (consent) {
    consent.classList.add('fineprint');
    form.append(consent);
  }

  const main = document.createElement('div');
  main.className = 'uf-main';
  heads.forEach((h) => main.append(h));
  intros.forEach((p) => {
    p.classList.add('uf-intro');
    main.append(p);
  });
  main.append(form);

  if (variant === 'subscribe' && media) {
    block.append(main);
    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'uf-media';
    mediaWrap.append(media);
    block.append(mediaWrap);
  } else {
    block.append(main);
  }
}
