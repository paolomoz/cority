/*
 * Cority chrome — code-owned footer (stardust canon: footer.html 4259aee7).
 * Subscribe band + mega footer. The subscribe band is identical chrome on all
 * 10 archetype pages, so it ships inside the footer block (audited adjustment
 * carried over from the prototypes).
 */
const CHROME = `
<div class="subscribe">
  <div class="wrap">
    <img src="https://www.cority.com/wp-content/uploads/2025/11/Cority_Always_Ahead_White-1.svg" alt="Cority — Always Ahead" width="528" height="96" loading="lazy">
    <p>Subscribe for EHS &amp; ESG insights, event invites, and industry updates!</p>
    <a class="btn btn-primary" href="https://www.cority.com/subscribe/">Subscribe</a>
  </div>
</div>
<div class="mega">
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-promo">
        <h2>CorityOne</h2>
        <div class="promo-cols">
          <div>
            <p>The EHS+ platform that converges people, data, and AI agents across safety, health, environmental, quality, and sustainability — so you can stop responding to risk and start eliminating it.</p>
            <a class="see" href="https://www.cority.com/corityone/">See It In Action ➜</a>
          </div>
          <img src="https://www.cority.com/wp-content/uploads/2025/08/ui-banner.webp" alt="CorityOne global overview dashboard" width="666" height="423" loading="lazy">
        </div>
        <div class="awards-mini">
          <a href="https://www.cority.com/awards/"><img src="https://www.cority.com/wp-content/uploads/2025/08/award-ehs-software.webp" alt="" width="176" height="176" loading="lazy">Verdantix Green Quadrant — 2025 Leader EHS Software</a>
          <a href="https://www.cority.com/awards/"><img src="https://www.cority.com/wp-content/uploads/2025/08/award-esgsustainability.webp" alt="" width="176" height="176" loading="lazy">Verdantix Green Quadrant — 2025 ESG &amp; Sustainability Reporting Software</a>
        </div>
      </div>
      <nav aria-label="Platform">
        <h3>Platform</h3>
        <ul>
          <li><a href="https://www.cority.com/corityone/">CorityOne Overview</a></li>
          <li><a href="https://www.cority.com/cortex-ai/">Cortex AI</a></li>
          <li><a href="https://www.cority.com/corityone/risk-management-software/">Risk Management</a></li>
          <li><a href="https://www.cority.com/corityone/incident-management-software/">Incident Management</a></li>
          <li><a href="https://www.cority.com/corityone/analytics-reporting/">Analytics</a></li>
          <li><a href="https://www.cority.com/corityone/mycority-mobile-ehs/">myCority Mobile EHS</a></li>
          <li><a href="https://www.cority.com/corityone/learning-management/">Learning Management</a></li>
          <li><a href="https://www.cority.com/corityone/document-control-software/">Document Control</a></li>
          <li><a href="https://www.cority.com/corityone/audit-inspections/">Audits &amp; Inspection</a></li>
          <li><a href="https://www.cority.com/corityone/management-of-change/">Management of Change</a></li>
        </ul>
      </nav>
      <nav aria-label="Solutions">
        <h3>Solutions</h3>
        <ul>
          <li><a href="https://www.cority.com/corityone/compliance-management-software/">Environmental Compliance</a></li>
          <li><a href="https://www.cority.com/health-cloud/occupational-health-solutions/">Workforce Health</a></li>
          <li><a href="https://www.cority.com/corityone/risk-management-software/">Safety Management</a></li>
          <li><a href="https://www.cority.com/sustainability-cloud/">Sustainability &amp; ESG</a></li>
          <li><a href="https://www.cority.com/quality-cloud/">Product Quality</a></li>
          <li><a href="https://www.cority.com/environmental-cloud/air-emissions-management/">Emissions Management</a></li>
          <li><a href="https://www.cority.com/health-cloud/industrial-hygiene-software/">Industrial Hygiene</a></li>
          <li><a href="https://www.cority.com/health-cloud/industrial-ergonomics/">Ergonomics</a></li>
          <li><a href="https://www.cority.com/industries/chemical-ehs-software/">Chemical Management</a></li>
          <li><a href="https://www.cority.com/environmental-cloud/waste-management-software/">Waste Management</a></li>
        </ul>
      </nav>
      <nav aria-label="Industries">
        <h3>Industries</h3>
        <ul>
          <li><a href="/industries/manufacturing-ehs-software">Manufacturing</a></li>
          <li><a href="https://www.cority.com/industries/mining-metals-ehs-software/">Mining &amp; Metals</a></li>
          <li><a href="https://www.cority.com/industries/chemical-ehs-software/">Chemicals</a></li>
          <li><a href="https://www.cority.com/industries/oil-and-gas-ehs-software/">Oil &amp; Gas</a></li>
          <li><a href="https://www.cority.com/industries/construction-ehs-software/">Construction</a></li>
          <li><a href="https://www.cority.com/industries/utility-and-energy-ehs-software/">Energy &amp; Utilities</a></li>
          <li><a href="https://www.cority.com/industries/hospital-and-medical-ehs-software/">Hospital &amp; Medical</a></li>
          <li><a href="https://www.cority.com/industries/pharma-biotech-health-ehs-software/">Pharma &amp; Biotech</a></li>
          <li><a href="https://www.cority.com/industries/food-and-beverage-ehs-software/">Food &amp; Beverage</a></li>
          <li><a href="https://www.cority.com/public-sector-government/">Government &amp; Public Sector</a></li>
        </ul>
      </nav>
    </div>
    <div class="legal">
      <p><a href="https://www.cority.com/contact-us/">Contact us</a> &nbsp;|&nbsp; <a href="https://www.cority.com/legal-center/privacy-policy/">Privacy Policy</a> &nbsp;|&nbsp; <a href="https://www.cority.com/legal-center/">Legal</a></p>
      <p>© 2026 Cority. All rights reserved.</p>
    </div>
  </div>
</div>
`;

export default async function decorate(block) {
  block.innerHTML = CHROME;
}
