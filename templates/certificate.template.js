const certificateTemplate = ({
  userName,
  courseTitle,
  certificateNumber,
  issuedAt,
  instructorName = "LearnHub Instructor",
}) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8" />
  
    <style>
      @page {
        size: A4 landscape;
        margin: 0;
      }
  
      * {
        box-sizing: border-box;
      }
  
      body {
        margin: 0;
        width: 297mm;
        height: 210mm;
        font-family: Arial, Helvetica, sans-serif;
        background: #ffffff;
        color: #1f2937;
      }
  
      .certificate {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 18mm;
        overflow: hidden;
        background: #ffffff;
      }
  
      /* Outer border */
      .certificate-border {
        position: absolute;
        inset: 8mm;
        border: 2px solid #e5e7eb;
      }
  
      /* Theme accent */
      .top-accent {
        position: absolute;
        top: 8mm;
        left: 8mm;
        right: 8mm;
        height: 7px;
        background: linear-gradient(
          90deg,
          #2563eb,
          #4f46e5,
          #7c3aed
        );
      }
  
      .content {
        position: relative;
        z-index: 2;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
  
      /* Header */
  
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
  
      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
      }
  
      .logo-circle {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #eef2ff;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #c7d2fe;
      }
  
      .logo-icon {
        font-size: 24px;
        color: #2563eb;
      }
  
      .brand-name {
        font-size: 24px;
        font-weight: 700;
        color: #3730a3;
        letter-spacing: -0.5px;
      }
  
      .brand-subtitle {
        font-size: 12px;
        color: #6b7280;
        margin-top: 2px;
      }
  
      .certificate-id {
        font-size: 11px;
        color: #6b7280;
        text-align: right;
      }
  
      .certificate-id strong {
        display: block;
        margin-top: 4px;
        color: #374151;
        font-size: 12px;
      }
  
  
      /* Main content */
  
      .main {
        text-align: center;
        margin-top: 10mm;
      }
  
      .certificate-label {
        text-transform: uppercase;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 4px;
        color: #6366f1;
        margin-bottom: 12px;
      }
  
      .title {
        font-size: 42px;
        font-weight: 700;
        color: #111827;
        margin: 0 0 22px;
        letter-spacing: -1px;
      }
  
      .description {
        font-size: 17px;
        color: #6b7280;
        margin-bottom: 10px;
      }
  
      .user-name {
        font-size: 34px;
        font-weight: 700;
        color: #3730a3;
        margin: 12px 0;
        padding-bottom: 10px;
        display: inline-block;
        border-bottom: 3px solid #818cf8;
        min-width: 300px;
      }
  
      .completion-text {
        font-size: 16px;
        color: #6b7280;
        margin: 20px 0 8px;
      }
  
      .course-title {
        font-size: 27px;
        font-weight: 600;
        color: #1f2937;
        max-width: 850px;
        margin: 0 auto;
        line-height: 1.3;
      }
  
  
      /* Footer */
  
      .footer {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        align-items: end;
        gap: 30px;
        padding: 0 15mm;
      }
  
      .footer-item {
        text-align: center;
      }
  
      .line {
        border-top: 1px solid #9ca3af;
        margin-bottom: 8px;
      }
  
      .footer-value {
        font-size: 14px;
        font-weight: 600;
        color: #374151;
      }
  
      .footer-label {
        margin-top: 4px;
        font-size: 11px;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
  
      /* Decorative circles */
  
      .shape {
        position: absolute;
        border-radius: 50%;
        z-index: 1;
      }
  
      .shape-1 {
        width: 180px;
        height: 180px;
        right: -70px;
        top: 80px;
        background: #eef2ff;
      }
  
      .shape-2 {
        width: 100px;
        height: 100px;
        left: -40px;
        bottom: -30px;
        background: #eff6ff;
      }
  
      .shape-3 {
        width: 50px;
        height: 50px;
        right: 100px;
        bottom: 40px;
        background: #f5f3ff;
      }
  
    </style>
  </head>
  
  
  <body>
  
    <div class="certificate">
  
      <div class="certificate-border"></div>
      <div class="top-accent"></div>
  
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
  
  
      <div class="content">
  
        <!-- Header -->
  
        <div class="header">
  
          <div class="brand">
  
            <div class="logo-circle">
              <span class="logo-icon">🎓</span>
            </div>
  
            <div>
              <div class="brand-name">
                LearnHub
              </div>
  
              <div class="brand-subtitle">
                Courses Platform
              </div>
            </div>
  
          </div>
  
  
          <div class="certificate-id">
            CERTIFICATE ID
  
            <strong>
              ${certificateNumber}
            </strong>
          </div>
  
        </div>
  
  
        <!-- Main -->
  
        <div class="main">
  
          <div class="certificate-label">
            Certificate of Completion
          </div>
  
  
          <h1 class="title">
            Congratulations!
          </h1>
  
  
          <div class="description">
            This certificate is proudly presented to
          </div>
  
  
          <div class="user-name">
            ${userName}
          </div>
  
  
          <div class="completion-text">
            for successfully completing the course
          </div>
  
  
          <div class="course-title">
            ${courseTitle}
          </div>
  
        </div>
  
  
        <!-- Footer -->
  
        <div class="footer">
  
          <div class="footer-item">
  
            <div class="line"></div>
  
            <div class="footer-value">
              ${instructorName}
            </div>
  
            <div class="footer-label">
              Instructor
            </div>
  
          </div>
  
  
          <div class="footer-item">
  
            <div class="line"></div>
  
            <div class="footer-value">
              ${issuedAt}
            </div>
  
            <div class="footer-label">
              Date Issued
            </div>
  
          </div>
  
  
          <div class="footer-item">
  
            <div class="line"></div>
  
            <div class="footer-value">
              LearnHub
            </div>
  
            <div class="footer-label">
              Courses Platform
            </div>
  
          </div>
  
        </div>
  
      </div>
  
    </div>
  
  </body>
  
  </html>
    `;
};

module.exports = certificateTemplate;
