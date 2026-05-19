// Active8 Managed Technologies — Shared Form Utilities
// https://b4ldini.github.io/hudu-widgets/js/a8-forms.js
// Add new form methods here and reference this file from any KB article form.

// ── Internal helpers ──────────────────────────────────────────────────────────

function _a8ValidateForm(formId, validationMsgId) {
  const form = document.getElementById(formId);
  const required = form.querySelectorAll('[required]');
  let valid = true;
  required.forEach(el => {
    if (!el.value.trim()) {
      el.style.borderColor = '#e05252';
      valid = false;
    } else {
      el.style.borderColor = '';
    }
  });
  if (!valid && validationMsgId) {
    document.getElementById(validationMsgId).classList.add('show');
  } else if (validationMsgId) {
    document.getElementById(validationMsgId).classList.remove('show');
  }
  return valid;
}

function _a8BuildNewUserEmail() {
  const g = id => document.getElementById(id)?.value?.trim() || '(not provided)';
  const r = name => {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : '(not specified)';
  };
  const startDateRaw = document.getElementById('startdate').value;
  const startDate = startDateRaw
    ? new Date(startDateRaw).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    : '(not provided)';
  const authDateRaw = document.getElementById('authDate').value;
  const authDate = authDateRaw
    ? new Date(authDateRaw).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    : '(not provided)';

  const body = [
    'NEW USER REQUEST',
    '=====================================',
    '',
    'USER DETAILS',
    '------------',
    `Forename:                    ${g('forename')}`,
    `Surname:                     ${g('surname')}`,
    `Office / Dept / Job Title:   ${g('jobtitle')}`,
    `Start Date:                  ${startDate}`,
    `Email Address:               ${g('email')}`,
    `Logon Username:              ${g('username')}`,
    `Logon Password:              ${g('password')}`,
    `Account to copy from:        ${g('copyFrom')}`,
    `M365 Licence Required:       ${g('m365licence')}`,
    `Leaver (licence transfer):   ${g('leaverName')}`,
    `New Laptop Required:         ${r('newLaptop')}`,
    `Existing Machine Name:       ${g('machineName')}`,
    '',
    'SERVICES & ACCESS REQUIREMENTS',
    '-------------------------------',
    `Email Groups:                ${g('emailGroups')}`,
    `Additional Mailbox Access:   ${g('mailboxAccess')}`,
    `Remote Access (VPN):         ${r('vpn')}`,
    `Remote Access (Terminal):    ${r('terminalServer')}`,
    `Network / Shared Drives:     ${g('sharedDrives')}`,
    `Other Notes:                 ${g('otherNotes')}`,
    '',
    'AUTHORISATION',
    '--------------',
    `Authorised by:               ${g('authName')}`,
    `Company:                     ${g('authCompany')}`,
    `Date of Authorisation:       ${authDate}`,
    '',
    '=====================================',
    'Submitted via a8 New User Request Form',
  ].join('\n');

  const subject = `New User Request \u2013 ${g('forename')} ${g('surname')} (Start: ${startDate})`;
  return { subject, body };
}

// ── Public methods ─────────────────────────────────────────────────────────────

/**
 * submitForm()
 * Validates the new user request form and shows the copy-to-clipboard panel.
 * Called by the "Prepare Email" button.
 */
function submitForm() {
  if (!_a8ValidateForm('newUserForm', 'validationMsg')) return;

  const { subject, body } = _a8BuildNewUserEmail();

  document.getElementById('copySubject').value = subject;
  document.getElementById('copyBody').value = body;

  const panel = document.getElementById('copyPanel');
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * openEmailClient()
 * Validates the form then attempts to open the system email client via a
 * mailto: link. May be blocked in sandboxed iframes (e.g. Hudu). If it fails,
 * direct the user to use the "Prepare Email" button instead.
 */
function openEmailClient() {
  if (!_a8ValidateForm('newUserForm', 'validationMsg')) return;

  const { subject, body } = _a8BuildNewUserEmail();
  const mailtoHref = `mailto:itsupport@a8mt.co.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(mailtoHref, '_blank');
}

/**
 * copyField(fieldId, btnId)
 * Copies the value of a read-only input or textarea to the clipboard and
 * briefly updates the button label to confirm.
 */
function copyField(fieldId, btnId) {
  const el = document.getElementById(fieldId);
  const btn = document.getElementById(btnId);
  const original = btn.textContent;
  const finish = () => {
    btn.textContent = '\u2713 Copied!';
    setTimeout(() => { btn.textContent = original; }, 2000);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(el.value).then(finish);
  } else {
    el.select();
    document.execCommand('copy');
    finish();
  }
}
