// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    setTheme('light');
  } else {
    setTheme('dark');
  }
}

const savedTheme = localStorage.getItem('theme') || 
                  (prefersDarkScheme.matches ? 'dark' : 'light');
setTheme(savedTheme);

themeToggle.addEventListener('click', toggleTheme);

// Template and Theme Customization
const templateSelect = document.getElementById('templateSelect');
const colorPicker = document.getElementById('colorPicker');
const fontSelect = document.getElementById('fontSelect');

function initTemplate() {
  const savedTemplate = localStorage.getItem('resumeTemplate') || 'classic';
  const savedColor = localStorage.getItem('accentColor') || '#007BFF';
  const savedFont = localStorage.getItem('fontFamily') || "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  
  templateSelect.value = savedTemplate;
  colorPicker.value = savedColor;
  fontSelect.value = savedFont;
  
  applyTemplate(savedTemplate);
  applyAccentColor(savedColor);
  applyFontFamily(savedFont);
}

function applyTemplate(template) {
  document.documentElement.setAttribute('data-template', template);
  localStorage.setItem('resumeTemplate', template);
}

function applyAccentColor(color) {
  document.documentElement.style.setProperty('--user-accent-color', color);
  localStorage.setItem('accentColor', color);
}

function applyFontFamily(font) {
  document.documentElement.style.setProperty('--user-font', font);
  localStorage.setItem('fontFamily', font);
}

templateSelect.addEventListener('change', (e) => {
  applyTemplate(e.target.value);
});

colorPicker.addEventListener('input', (e) => {
  applyAccentColor(e.target.value);
});

fontSelect.addEventListener('change', (e) => {
  applyFontFamily(e.target.value);
});

// DOM Elements and Constants
const formFields = [
  "nameInput",
  "emailInput",
  "phoneInput",
  "summaryInput",
  "skillsInput"
];

const formElements = {
  nameInput: 'namePreview',
  emailInput: 'emailPreview',
  phoneInput: 'phonePreview',
  summaryInput: 'summaryPreview',
  skillsInput: 'skillsPreview'
};

function updateProgress() {
  const totalFields = 5 + 
    (document.querySelectorAll('#experienceFields textarea').length > 0 ? 1 : 0) +
    (document.querySelectorAll('#educationFields textarea').length > 0 ? 1 : 0) +
    (document.querySelectorAll('#projectFields textarea').length > 0 ? 1 : 0) +
    (document.querySelectorAll('#certificationFields textarea').length > 0 ? 1 : 0) +
    (document.querySelectorAll('#languageFields textarea').length > 0 ? 1 : 0);
  
  let completedFields = 0;

  formFields.forEach(id => {
    if (document.getElementById(id).value.trim() !== '') {
      completedFields++;
    }
  });

  ['experienceFields', 'educationFields', 'projectFields', 'certificationFields', 'languageFields'].forEach(fieldType => {
    const fields = document.querySelectorAll(`#${fieldType} textarea`);
    if (fields.length > 0 && Array.from(fields).some(f => f.value.trim() !== '')) {
      completedFields++;
    }
  });

  const progress = Math.min(Math.round((completedFields / totalFields) * 100), 100);
  document.getElementById('progressBar').style.width = `${progress}%`;
  document.getElementById('progressText').textContent = `${progress}% complete`;
}

document.addEventListener('DOMContentLoaded', () => {
  initTemplate();
  loadFormFields();
  
  ['experience', 'education', 'project', 'certification', 'language'].forEach(section => {
    const containerId = `${section}Fields`;
    const previewId = `${section}Preview`;
    
    loadDynamicFields(containerId, previewId);
    if (document.querySelectorAll(`#${containerId} textarea`).length === 0) {
      window[`add${section.charAt(0).toUpperCase() + section.slice(1)}`]();
    }
  });
  
  updateSkillsPreview();
  updateProgress();
});

function loadFormFields() {
  formFields.forEach(id => {
    const input = document.getElementById(id);
    const savedValue = localStorage.getItem(id);
    
    if (savedValue) {
      input.value = savedValue;
      if (formElements[id]) updatePreview(id, savedValue);
    }

    input.addEventListener("input", () => {
      localStorage.setItem(id, input.value);
      if (formElements[id]) updatePreview(id, input.value);
      updateProgress();
    });
  });
}

function updatePreview(inputId, value) {
  const previewId = formElements[inputId];
  if (inputId === 'skillsInput') {
    updateSkillsPreview();
  } else {
    document.getElementById(previewId).textContent = value || '...';
  }
}

document.getElementById('skillsInput').addEventListener('input', () => {
  updateSkillsPreview();
  updateProgress();
});

function updateSkillsPreview() {
  const skillsValue = document.getElementById('skillsInput').value;
  const skillsArray = skillsValue.split(',').map(skill => skill.trim()).filter(Boolean);
  const skillsList = document.getElementById('skillsPreview');
  
  skillsList.innerHTML = '';
  skillsArray.forEach(skill => {
    const li = document.createElement('li');
    li.textContent = skill;
    skillsList.appendChild(li);
  });
  
  localStorage.setItem('skillsInput', skillsValue);
}

function addExperience() {
  addDynamicField('experienceFields', 'Job title, Company, Duration (e.g., "Software Engineer, Google, 2020-2022")', 'experiencePreview');
}

function addEducation() {
  addDynamicField('educationFields', 'Degree, University, Year (e.g., "BSc Computer Science, MIT, 2020")', 'educationPreview');
}

function addProject() {
  addDynamicField('projectFields', 'Project name, Technologies, Description (e.g., "E-commerce Website, React/Node.js, Built a full-stack...")', 'projectPreview');
}

function addCertification() {
  addDynamicField('certificationFields', 'Certification name, Issuer, Year (e.g., "AWS Certified Developer, Amazon, 2022")', 'certificationPreview');
}

function addLanguage() {
  addDynamicField('languageFields', 'Language, Proficiency (e.g., "Spanish, Fluent")', 'languagePreview');
}

function addDynamicField(containerId, placeholder, previewId) {
  const container = document.getElementById(containerId);
  const fieldId = `${containerId}-${Date.now()}`;
  
  const fieldGroup = document.createElement('div');
  fieldGroup.className = 'field-group';
  
  const textarea = document.createElement('textarea');
  textarea.rows = 2;
  textarea.placeholder = placeholder;
  textarea.dataset.fieldId = fieldId;
  
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.textContent = 'Remove';
  removeBtn.className = 'remove-btn';
  removeBtn.onclick = () => removeDynamicField(fieldGroup, containerId, previewId);
  
  textarea.addEventListener('input', () => {
    updateDynamicPreview(containerId, previewId);
    saveDynamicFields(containerId);
    updateProgress();
  });
  
  fieldGroup.appendChild(textarea);
  fieldGroup.appendChild(removeBtn);
  container.appendChild(fieldGroup);
  
  updateDynamicPreview(containerId, previewId);
  saveDynamicFields(containerId);
  updateProgress();
  textarea.focus();
}

function removeDynamicField(fieldGroup, containerId, previewId) {
  if (document.querySelectorAll(`#${containerId} .field-group`).length <= 1) {
    alert('You need to keep at least one entry');
    return;
  }
  
  if (confirm('Are you sure you want to remove this entry?')) {
    fieldGroup.remove();
    updateDynamicPreview(containerId, previewId);
    saveDynamicFields(containerId);
    updateProgress();
  }
}

function updateDynamicPreview(containerId, previewId) {
  const fields = document.querySelectorAll(`#${containerId} textarea`);
  const preview = document.getElementById(previewId);
  
  preview.innerHTML = '';
  
  if (Array.from(fields).every(field => field.value.trim() === '')) {
    const defaultText = {
      'experienceFields': 'Your experience entries will appear here',
      'educationFields': 'Your education entries will appear here',
      'projectFields': 'Your projects will appear here',
      'certificationFields': 'Your certifications will appear here',
      'languageFields': 'Your languages will appear here'
    }[containerId];
    
    const p = document.createElement('p');
    p.textContent = defaultText;
    p.style.color = '#999';
    preview.appendChild(p);
    return;
  }
  
  fields.forEach(field => {
    if (field.value.trim() !== '') {
      const p = document.createElement('p');
      p.textContent = field.value;
      preview.appendChild(p);
    }
  });
}

function loadDynamicFields(containerId, previewId) {
  const savedData = localStorage.getItem(containerId);
  if (savedData) {
    const data = JSON.parse(savedData);
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    data.forEach(value => {
      const fieldId = `${containerId}-${Date.now()}`;
      
      const fieldGroup = document.createElement('div');
      fieldGroup.className = 'field-group';
      
      const textarea = document.createElement('textarea');
      textarea.rows = 2;
      textarea.value = value;
      textarea.dataset.fieldId = fieldId;
      textarea.placeholder = {
        'experienceFields': 'Job title, Company, Duration',
        'educationFields': 'Degree, University, Year',
        'projectFields': 'Project name, Technologies, Description',
        'certificationFields': 'Certification name, Issuer, Year',
        'languageFields': 'Language, Proficiency'
      }[containerId];
      
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.textContent = 'Remove';
      removeBtn.className = 'remove-btn';
      removeBtn.onclick = () => removeDynamicField(fieldGroup, containerId, previewId);
      
      textarea.addEventListener('input', () => {
        updateDynamicPreview(containerId, previewId);
        saveDynamicFields(containerId);
        updateProgress();
      });
      
      fieldGroup.appendChild(textarea);
      fieldGroup.appendChild(removeBtn);
      container.appendChild(fieldGroup);
    });
    
    updateDynamicPreview(containerId, previewId);
    updateProgress();
  }
}

function saveDynamicFields(containerId) {
  const fields = document.querySelectorAll(`#${containerId} textarea`);
  const data = Array.from(fields).map(field => field.value);
  localStorage.setItem(containerId, JSON.stringify(data));
}

function printResume() {
  if (!validateForm()) return;

  const currentTemplate = document.documentElement.getAttribute('data-template');
  const currentColor = colorPicker.value;
  const currentFont = fontSelect.value;
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const isDarkMode = currentTheme === 'dark';

  // Create a deep clone of the preview section
  const previewClone = document.getElementById('resume-preview').cloneNode(true);
  
  // Create print-specific styles
  const printStyles = `
    <style>
      body {
        font-family: ${currentFont};
        --primary-color: ${currentColor};
        line-height: 1.6;
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
        color: ${isDarkMode ? '#f8f9fa' : '#212529'};
        background: ${isDarkMode ? '#212529' : '#ffffff'};
      }
      
      /* Template-specific styles */
      .preview-section {
        background: ${isDarkMode ? '#2c3034' : '#ffffff'};
        ${currentTemplate === 'modern' ? `border-left: 4px solid ${currentColor}; padding-left: 20px;` : ''}
        ${currentTemplate === 'minimalist' ? 'background: transparent; box-shadow: none; padding: 0;' : ''}
      }
      
      h1 {
        color: ${currentColor};
        ${currentTemplate === 'classic' ? `border-bottom: 2px solid ${currentColor};` : 'border-bottom: none;'}
        padding-bottom: 10px;
        margin-bottom: 10px;
        ${currentTemplate === 'minimalist' ? 'font-size: 24px; font-weight: 600; letter-spacing: -0.5px;' : ''}
      }
      
      h3 {
        color: ${currentTemplate === 'modern' ? (isDarkMode ? '#f8f9fa' : '#444') : currentColor};
        margin-top: 25px;
        margin-bottom: 10px;
        ${currentTemplate === 'classic' ? 'border-bottom: 1px solid #eee;' : 'border-bottom: none;'}
        padding-bottom: 5px;
        ${currentTemplate === 'minimalist' ? 'font-size: 16px; text-transform: uppercase; letter-spacing: 1px;' : ''}
      }
      
      p, li {
        color: ${isDarkMode ? '#f8f9fa' : '#212529'};
        margin: 5px 0;
      }
      
      ul {
        padding-left: 20px;
      }
      
      /* Print-specific adjustments */
      @media print {
        body {
          padding: 0;
          font-size: 14px;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        @page {
          size: A4;
          margin: 1cm;
        }
      }
    </style>
  `;

  // Create print document
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>My Resume</title>
        ${printStyles}
      </head>
      <body>
        ${previewClone.outerHTML}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 200);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

function getTemplatePrintStyles(template) {
  const styles = {
    'modern': `
      .preview-section {
        border-left: 4px solid var(--primary-color);
        padding-left: 20px;
      }
      h1 { border-bottom: none; }
      h3 { border-bottom: none; }
    `,
    'minimalist': `
      .preview-section {
        background: transparent;
        box-shadow: none;
        padding: 0;
      }
      h1 { 
        font-size: 24px;
        border-bottom: none;
        letter-spacing: -0.5px;
      }
      h3 { 
        font-size: 16px;
        border-bottom: none;
        margin-top: 20px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
    `,
    'classic': ''
  };
  return styles[template] || '';
}

function validateForm() {
  const name = document.getElementById('nameInput').value.trim();
  const email = document.getElementById('emailInput').value.trim();
  
  if (!name) {
    alert('Please enter your full name');
    document.getElementById('nameInput').focus();
    return false;
  }
  
  if (!email) {
    alert('Please enter your email address');
    document.getElementById('emailInput').focus();
    return false;
  }
  
  if (!isValidEmail(email)) {
    alert('Please enter a valid email address');
    document.getElementById('emailInput').focus();
    return false;
  }
  
  return true;
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function clearResume() {
  if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
    localStorage.clear();
    location.reload();
  }
}
