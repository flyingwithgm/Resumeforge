let resumeData = {
  fullName: '',
  jobTitle: '',
  email: '',
  phone: '',
  linkedin: '',
  summary: '',
  skills: [],
  experience: [],
  education: []
};

const switchTheme = () => {
  const theme = document.getElementById('themeSwitcher').value;
  const root = document.documentElement;
  root.classList.remove('light', 'dark', 'custom');
  root.classList.add(theme);
};

const switchTemplate = () => {
  const template = document.getElementById('templateSwitcher').value;
  const resume = document.getElementById('resumePreview');
  resume.classList.remove('resume-modern', 'resume-classic');
  resume.classList.add(`resume-${template}`);
};

const updatePreview = () => {
  // Basic Info
  document.getElementById('previewName').textContent = resumeData.fullName || 'Your Name';
  document.getElementById('previewTitle').textContent = resumeData.jobTitle || 'Your Title';

  // Contact
  const contactHTML = `
    ${resumeData.email ? `<span>${resumeData.email}</span>` : ''}
    ${resumeData.phone ? `<span class="mx-2">|</span><span>${resumeData.phone}</span>` : ''}
    ${resumeData.linkedin ? `<span class="mx-2">|</span><a href="${resumeData.linkedin}" target="_blank" class="text-blue-500 hover:underline">LinkedIn</a>` : ''}
  `;
  document.getElementById('previewContact').innerHTML = contactHTML;

  // Summary
  document.getElementById('previewSummary').textContent = resumeData.summary || 'Short professional summary...';

  // Skills
  document.getElementById('previewSkills').innerHTML = resumeData.skills.map(skill => `<li>${skill}</li>`).join('') || '<li>Skill 1</li>';

  // Experience
  const experienceHTML = resumeData.experience.map(job => `
    <div class="mb-4">
      <h3 class="font-semibold text-lg">${job.title || 'Job Title'} at ${job.company || 'Company'}</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">${job.dates || 'Dates'}</p>
      <p class="text-sm mt-1">${job.description || 'Job description...'}</p>
    </div>
  `).join('');
  document.getElementById('previewExperience').innerHTML = experienceHTML || '<p>Your experience details...</p>';

  // Education
  const educationHTML = resumeData.education.map(edu => `
    <div class="mb-3">
      <h3 class="font-semibold text-lg">${edu.degree || 'Degree'} at ${edu.school || 'School'}</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">${edu.dates || 'Dates'}</p>
    </div>
  `).join('');
  document.getElementById('previewEducation').innerHTML = educationHTML || '<p>Your education details...</p>';

  saveData();
}

const addExperienceEntry = (exp = { title: '', company: '', dates: '', description: '' }) => {
  const container = document.getElementById('experienceContainer');
  const index = resumeData.experience.length;
  if (exp.title === '' && exp.company === '') { // Only push if it's a new entry
      resumeData.experience.push(exp);
  }

  const entry = document.createElement('div');
  entry.classList.add('space-y-2', 'border', 'p-3', 'rounded', 'mb-3');
  entry.innerHTML = `
    <input type="text" value="${exp.title}" placeholder="Job Title" class="w-full p-2 border rounded" oninput="updateExperience(${index}, 'title', this.value)">
    <input type="text" value="${exp.company}" placeholder="Company" class="w-full p-2 border rounded" oninput="updateExperience(${index}, 'company', this.value)">
    <input type="text" value="${exp.dates}" placeholder="Dates (e.g., Jan 2020 - Present)" class="w-full p-2 border rounded" oninput="updateExperience(${index}, 'dates', this.value)">
    <textarea placeholder="Description" class="w-full p-2 border rounded" oninput="updateExperience(${index}, 'description', this.value)">${exp.description}</textarea>
  `;
  container.appendChild(entry);
}

const addEducationEntry = (edu = { school: '', degree: '', dates: '' }) => {
  const container = document.getElementById('educationContainer');
  const index = resumeData.education.length;
  if (edu.school === '' && edu.degree === '') {
    resumeData.education.push(edu);
  }

  const entry = document.createElement('div');
  entry.classList.add('space-y-2', 'border', 'p-3', 'rounded', 'mb-3');
  entry.innerHTML = `
    <input type="text" value="${edu.school}" placeholder="School or University" class="w-full p-2 border rounded" oninput="updateEducation(${index}, 'school', this.value)">
    <input type="text" value="${edu.degree}" placeholder="Degree or Certificate" class="w-full p-2 border rounded" oninput="updateEducation(${index}, 'degree', this.value)">
    <input type="text" value="${edu.dates}" placeholder="Dates (e.g., Aug 2016 - May 2020)" class="w-full p-2 border rounded" oninput="updateEducation(${index}, 'dates', this.value)">
  `;
  container.appendChild(entry);
}

const updateExperience = (index, field, value) => {
  resumeData.experience[index][field] = value;
  updatePreview();
}

const updateEducation = (index, field, value) => {
  resumeData.education[index][field] = value;
  updatePreview();
}

const saveData = () => {
  localStorage.setItem('resumeData', JSON.stringify(resumeData));
}

const loadData = () => {
  const savedData = localStorage.getItem('resumeData');
  if (savedData) {
    resumeData = JSON.parse(savedData);

    // Repopulate simple fields
    document.getElementById('fullName').value = resumeData.fullName;
    document.getElementById('jobTitle').value = resumeData.jobTitle;
    document.getElementById('email').value = resumeData.email;
    document.getElementById('phone').value = resumeData.phone;
    document.getElementById('linkedin').value = resumeData.linkedin;
    document.getElementById('summary').value = resumeData.summary;
    document.getElementById('skills').value = resumeData.skills.join(', ');

    // Clear and repopulate dynamic sections
    document.getElementById('experienceContainer').innerHTML = '';
    resumeData.experience.forEach((item, index) => {
      addExperienceEntry(item);
    });

    document.getElementById('educationContainer').innerHTML = '';
    resumeData.education.forEach((item, index) => {
      addEducationEntry(item);
    });

  } else {
    // If no saved data, start with one empty entry for each section
    addExperienceEntry();
    addEducationEntry();
  }

  updatePreview();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('fullName').addEventListener('input', e => { resumeData.fullName = e.target.value; updatePreview(); });
  document.getElementById('jobTitle').addEventListener('input', e => { resumeData.jobTitle = e.target.value; updatePreview(); });
  document.getElementById('email').addEventListener('input', e => { resumeData.email = e.target.value; updatePreview(); });
  document.getElementById('phone').addEventListener('input', e => { resumeData.phone = e.target.value; updatePreview(); });
  document.getElementById('linkedin').addEventListener('input', e => { resumeData.linkedin = e.target.value; updatePreview(); });
  document.getElementById('summary').addEventListener('input', e => { resumeData.summary = e.target.value; updatePreview(); });
  document.getElementById('skills').addEventListener('input', e => {
    resumeData.skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
    updatePreview();
  });

  document.getElementById('addExperience').addEventListener('click', () => {
    addExperienceEntry();
    updatePreview();
  });
  document.getElementById('addEducation').addEventListener('click', () => {
    addEducationEntry();
    updatePreview();
  });

  loadData();
});


const exportPDF = async () => {
  const preview = document.getElementById('resumePreview');
  // Temporarily remove shadow for cleaner PDF export
  preview.classList.add('shadow-none');

  const canvas = await html2canvas(preview, {
    scale: 2, // Use a higher scale for better resolution
    useCORS: true
  });

  // Restore shadow after canvas is created
  preview.classList.remove('shadow-none');

  const imgData = canvas.toDataURL('image/png');
  const { jsPDF } = window.jspdf;

  // Use A4 paper size (210mm x 297mm) and mm as units
  const pdf = new jsPDF('p', 'mm', 'a4');

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  // Calculate the image height in the PDF to maintain aspect ratio
  const ratio = canvasWidth / canvasHeight;
  const imgHeight = pdfWidth / ratio;

  let heightLeft = imgHeight;
  let position = 0;

  // Add the first page
  pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
  heightLeft -= pdfHeight;

  // Add new pages if content overflows
  while (heightLeft > 0) {
    position = -pdfHeight + position;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save('GM73_Resume.pdf');
  confetti();
};