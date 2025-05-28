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

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 
                  (prefersDarkScheme.matches ? 'dark' : 'light');
setTheme(savedTheme);

themeToggle.addEventListener('click', toggleTheme);

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

// Update progress tracking to include new sections
function updateProgress() {
  const totalFields = 5 + // Basic fields
    (document.querySelectorAll('#experienceFields textarea').length > 0 ? 1 : 0) +
    (document.querySelectorAll('#educationFields textarea').length > 0 ? 1 : 0) +
    (document.querySelectorAll('#projectFields textarea').length > 0 ? 1 : 0) +
    (document.querySelectorAll('#certificationFields textarea').length > 0 ? 1 : 0) +
    (document.querySelectorAll('#languageFields textarea').length > 0 ? 1 : 0);
  
  let completedFields = 0;

  // Check basic fields
  formFields.forEach(id => {
    if (document.getElementById(id).value.trim() !== '') {
      completedFields++;
    }
  });

  // Check experience fields
  const experienceFields = document.querySelectorAll('#experienceFields textarea');
  if (experienceFields.length > 0 && Array.from(experienceFields).some(f => f.value.trim() !== '')) {
    completedFields++;
  }

  // Check education fields
  const educationFields = document.querySelectorAll('#educationFields textarea');
  if (educationFields.length > 0 && Array.from(educationFields).some(f => f.value.trim() !== '')) {
    completedFields++;
  }

  // Check project fields
  const projectFields = document.querySelectorAll('#projectFields textarea');
  if (projectFields.length > 0 && Array.from(projectFields).some(f => f.value.trim() !== '')) {
    completedFields++;
  }

  // Check certification fields
  const certificationFields = document.querySelectorAll('#certificationFields textarea');
  if (certificationFields.length > 0 && Array.from(certificationFields).some(f => f.value.trim() !== '')) {
    completedFields++;
  }

  // Check language fields
  const languageFields = document.querySelectorAll('#languageFields textarea');
  if (languageFields.length > 0 && Array.from(languageFields).some(f => f.value.trim() !== '')) {
    completedFields++;
  }

  const progress = Math.min(Math.round((completedFields / totalFields) * 100), 100);
  document.getElementById('progressBar').style.width = `${progress}%`;
  document.getElementById('progressText').textContent = `${progress}% complete`;
}

document.addEventListener('DOMContentLoaded', () => {
  // Load basic form fields
  loadFormFields();
  
  // Load all dynamic fields
  loadDynamicFields('experienceFields', 'experiencePreview');
  loadDynamicFields('educationFields', 'educationPreview');
  loadDynamicFields('projectFields', 'projectPreview');
  loadDynamicFields('certificationFields', 'certificationPreview');
  loadDynamicFields('languageFields', 'languagePreview');
  
  // Initialize skills preview
  updateSkillsPreview();
  
  // Add first empty fields if none exist
  if (document.querySelectorAll('#experienceFields textarea').length === 0) {
    addExperience();
  }
  if (document.querySelectorAll('#educationFields textarea').length === 0) {
    addEducation();
  }
  if (document.querySelectorAll('#projectFields textarea').length === 0) {
    addProject();
  }
  if (document.querySelectorAll('#certificationFields textarea').length === 0) {
    addCertification();
  }
  if (document.querySelectorAll('#languageFields textarea').length === 0) {
    addLanguage();
  }
  
  // Initialize progress
  updateProgress();
});

// [Previous loadFormFields, updatePreview, and skills handling code remains the same]

// Add new dynamic field functions
function addProject() {
  addDynamicField('projectFields', 'Project name, Technologies, Description (e.g., "E-commerce Website, React/Node.js, Built a full-stack...")', 'projectPreview');
}

function addCertification() {
  addDynamicField('certificationFields', 'Certification name, Issuer, Year (e.g., "AWS Certified Developer, Amazon, 2022")', 'certificationPreview');
}

function addLanguage() {
  addDynamicField('languageFields', 'Language, Proficiency (e.g., "Spanish, Fluent")', 'languagePreview');
}

// Load and save basic form fields
function loadFormFields() {
  formFields.forEach(id => {
    const input = document.getElementById(id);
    const savedValue = localStorage.getItem(id);
    
    if (savedValue) {
      input.value = savedValue;
      // Trigger preview update for mapped fields
      if (formElements[id]) {
        updatePreview(id, savedValue);
      }
    }

    input.addEventListener("input", () => {
      localStorage.setItem(id, input.value);
      if (formElements[id]) {
        updatePreview(id, input.value);
      }
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

// Skills handling
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
  
  // Save to localStorage
  localStorage.setItem('skillsInput', skillsValue);
}

// Dynamic fields handling (Experience and Education)
function addExperience() {
  addDynamicField('experienceFields', 'Job title, Company, Duration (e.g., "Software Engineer, Google, 2020-2022")', 'experiencePreview');
}

function addEducation() {
  addDynamicField('educationFields', 'Degree, University, Year (e.g., "BSc Computer Science, MIT, 2020")', 'educationPreview');
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
  
  // Focus the new field
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
    const p = document.createElement('p');
    p.textContent = containerId.includes('experience') ? 'Your experience entries will appear here' : 'Your education entries will appear here';
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
      textarea.placeholder = containerId.includes('experience') 
        ? 'Job title, Company, Duration' 
        : 'Degree, University, Year';
      
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

// Print/Download functionality
function printResume() {
  // Validate required fields
  if (!validateForm()) {
    return;
  }

  const originalContent = document.body.innerHTML;
  const printStyles = `
    <style>
      body { 
        font-family: Arial, sans-serif; 
        line-height: 1.6; 
        padding: 40px; 
        max-width: 800px;
        margin: 0 auto;
        color: #333;
      }
      h1 { 
        color: #007BFF; 
        border-bottom: 2px solid #007BFF; 
        padding-bottom: 10px;
        margin-bottom: 10px;
      }
      h3 { 
        color: #444; 
        margin-top: 25px;
        margin-bottom: 10px;
        border-bottom: 1px solid #eee;
        padding-bottom: 5px;
      }
      ul { 
        padding-left: 20px; 
      }
      p {
        margin: 5px 0;
      }
      @media print {
        body { 
          padding: 0;
          font-size: 14px;
        }
        button { 
          display: none; 
        }
      }
      @page {
        size: A4;
        margin: 1cm;
      }
    </style>
  `;
  
  const resumeContent = document.getElementById('resume-preview').outerHTML;
  
  document.body.innerHTML = printStyles + resumeContent;
  window.print();
  document.body.innerHTML = originalContent;
  
  // Restore scroll position
  window.scrollTo(0, 0);
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

// Clear all data
function clearResume() {
  if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
    localStorage.clear();
    location.reload();
  }
}