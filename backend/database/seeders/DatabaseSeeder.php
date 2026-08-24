<?php

namespace Database\Seeders;

use App\Models\Attorney;
use App\Models\CaseResult;
use App\Models\ConsultationLead;
use App\Models\PracticeArea;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@lawfirm.com'],
            [
                'name' => 'Principal Counsel Admin',
                'password' => Hash::make('Password123!'),
                'email_verified_at' => now(),
            ]
        );

        // 2. Seed Practice Areas
        $corporate = PracticeArea::create([
            'title' => 'Corporate Law & M&A',
            'slug' => 'corporate-law-mergers',
            'icon' => 'Briefcase',
            'short_summary' => 'Comprehensive counsel on complex mergers, cross-border acquisitions, joint ventures, and regulatory corporate governance.',
            'description' => 'Our Corporate and Mergers & Acquisitions practice delivers sophisticated legal strategies for Fortune 500 corporations, private equity funds, and emerging market leaders. From multi-million dollar asset purchases and stock reorganizations to complex regulatory antitrust reviews, our attorneys structure resilient transactions designed to withstand intense regulatory scrutiny and drive institutional growth. We navigate SEC disclosures, shareholder dispute avoidance, and executive governance with relentless precision.',
            'is_featured' => true,
        ]);

        $antitrust = PracticeArea::create([
            'title' => 'Antitrust & Competition',
            'slug' => 'antitrust-competition-law',
            'icon' => 'Scale',
            'short_summary' => 'Defending market leaders in DOJ/FTC investigations, monopolization claims, and multi-district class action defense.',
            'description' => 'We defend global corporations facing federal antitrust scrutiny, cartels, unfair trade practice litigation, and regulatory merger blockades before the FTC and Department of Justice. Our litigators combine economic modeling expertise with relentless courtroom trial readiness.',
            'is_featured' => false,
            'parent_id' => $corporate->id,
        ]);

        $personalInjury = PracticeArea::create([
            'title' => 'Personal Injury & Catastrophic Harm',
            'slug' => 'personal-injury-catastrophic',
            'icon' => 'ShieldAlert',
            'short_summary' => 'Tenacious trial advocacy for victims of severe truck collisions, traumatic brain injuries, and industrial workplace disasters.',
            'description' => 'When catastrophic injury alters lives, our premier trial litigators step in to level the playing field against billion-dollar insurance conglomerates. We deploy dedicated accident reconstruction engineers, top medical experts, and forensic life-care planners to secure monumental compensation for medical rehabilitation, lifelong disability support, and pain and suffering. We operate on a contingency fee basis—no recovery, no fee.',
            'is_featured' => true,
        ]);

        $medMal = PracticeArea::create([
            'title' => 'Medical Malpractice & Pharma',
            'slug' => 'medical-malpractice',
            'icon' => 'HeartPulse',
            'short_summary' => 'Holding health systems and pharmaceutical manufacturers accountable for surgical negligence and fatal misdiagnoses.',
            'description' => 'Our medical malpractice department tackles cases involving surgical errors, anesthesia failure, birth trauma, oncology misdiagnosis, and dangerous defective pharmaceutical drugs. We thoroughly evaluate hospital protocols and secure full justice for aggrieved families.',
            'is_featured' => false,
            'parent_id' => $personalInjury->id,
        ]);

        $ipLaw = PracticeArea::create([
            'title' => 'Intellectual Property & Patents',
            'slug' => 'intellectual-property-patents',
            'icon' => 'Award',
            'short_summary' => 'Protecting high-tech patent portfolios, proprietary trade secrets, trademarks, and federal PTAB litigation.',
            'description' => 'In an era of relentless digital disruption, your intellectual capital is your most valuable asset. Our IP practice handles complex patent infringement trials in the US International Trade Commission (ITC), Federal Circuit appeals, global trademark enforcement, and non-compete trade secret injunctions across semiconductor, biotechnology, software, and AI sectors.',
            'is_featured' => true,
        ]);

        $whiteCollar = PracticeArea::create([
            'title' => 'White Collar & Investigations',
            'slug' => 'white-collar-criminal-defense',
            'icon' => 'Gavel',
            'short_summary' => 'Discreet, formidable defense against SEC, FINRA, FBI, and congressional investigations for executives and institutions.',
            'description' => 'Led by former federal prosecutors and seasoned trial litigators, our White Collar Defense group provides elite counsel for corporate officers, board directors, and entities facing allegations of securities fraud, FCPA violations, healthcare billing fraud, insider trading, and grand jury subpoenas. We strive for early declinations before charges are ever filed.',
            'is_featured' => true,
        ]);

        $realEstate = PracticeArea::create([
            'title' => 'Commercial Real Estate & Land Use',
            'slug' => 'commercial-real-estate-development',
            'icon' => 'Building2',
            'short_summary' => 'End-to-end legal structuring for commercial zoning, institutional acquisitions, syndications, and construction disputes.',
            'description' => 'We guide real estate developers, REITs, and institutional lenders through multi-parcel site acquisitions, zoning variances, commercial leasing, environmental compliance, and construction contract litigation across major metropolitan corridors.',
            'is_featured' => true,
        ]);

        $employment = PracticeArea::create([
            'title' => 'Executive Employment & Labor',
            'slug' => 'employment-labor-arbitration',
            'icon' => 'Users',
            'short_summary' => 'Resolving C-suite severance, non-compete disputes, workplace discrimination, and FLSA collective defense.',
            'description' => 'Our employment attorneys counsel boards and executives in structuring golden parachute packages, navigating executive separations, conducting sensitive internal investigations, and defending corporate clients against Title VII and wage-and-hour class actions.',
            'is_featured' => true,
        ]);

        // 3. Seed Attorneys
        $jonathan = Attorney::create([
            'name' => 'Jonathan Sterling, Esq.',
            'slug' => 'jonathan-sterling',
            'designation' => 'Senior Managing Partner',
            'email' => 'j.sterling@apexlegal.com',
            'phone' => '+1 (212) 890-4401',
            'photo_url' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
            'bio' => 'Jonathan Sterling has spent over 28 years commanding the boardrooms and federal courts of New York and Washington D.C. As Senior Managing Partner, Jonathan specializes in multi-billion dollar M&A transactions, corporate governance restructuring, and high-stakes cross-border dispute resolution. Recognized by Chambers USA and The Best Lawyers in America as a Tier 1 Corporate Counsel, he has successfully closed over $8.5 Billion in aggregate transactional value.',
            'bar_admissions' => [
                'New York State Bar (1996)',
                'U.S. District Court, Southern District of New York',
                'U.S. Court of Appeals for the Second Circuit',
                'District of Columbia Bar',
            ],
            'education' => [
                'J.D., Columbia Law School (Harlan Fiske Stone Scholar)',
                'B.A. in Economics, Dartmouth College (Summa Cum Laude)',
            ],
            'social_links' => [
                'linkedin' => 'https://linkedin.com/in/jonathan-sterling-apex',
                'twitter' => 'https://twitter.com/jsterling_law',
            ],
            'is_active' => true,
        ]);

        $eleanor = Attorney::create([
            'name' => 'Eleanor Vance, J.D.',
            'slug' => 'eleanor-vance',
            'designation' => 'Partner & Chair of Trial Litigation',
            'email' => 'e.vance@apexlegal.com',
            'phone' => '+1 (212) 890-4402',
            'photo_url' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
            'bio' => 'Eleanor Vance is one of the nation\'s most formidable personal injury and catastrophic trial lawyers. Renowned for her courtroom mastery and empathetic client care, Eleanor has recovered over $120 Million for victims of industrial negligence, catastrophic spinal injuries, and pharmaceutical malfeasance. She is an elected Fellow of the International Academy of Trial Lawyers and has served as lead trial counsel in 45+ jury verdicts.',
            'bar_admissions' => [
                'New York State Bar (2004)',
                'New Jersey State Bar (2004)',
                'U.S. District Court, Eastern District of New York',
                'American Association for Justice (Board of Governors)',
            ],
            'education' => [
                'J.D., Harvard Law School (Editor, Harvard Law Review)',
                'B.S. in Biology & Pre-Med, Yale University (Magna Cum Laude)',
            ],
            'social_links' => [
                'linkedin' => 'https://linkedin.com/in/eleanor-vance-trial',
            ],
            'is_active' => true,
        ]);

        $marcus = Attorney::create([
            'name' => 'Marcus A. Croft',
            'slug' => 'marcus-croft',
            'designation' => 'Partner, IP & Tech Innovation',
            'email' => 'm.croft@apexlegal.com',
            'phone' => '+1 (212) 890-4403',
            'photo_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
            'bio' => 'Marcus Croft bridges cutting-edge Silicon Valley computer science with aggressive intellectual property defense. Registered before the USPTO, Marcus protects patent claims, trade secrets, and artificial intelligence models for high-growth tech ventures and established multinationals. Prior to practicing law, Marcus was a Senior Software Architect, giving him unmatched technical insight during courtroom infringement demonstrations.',
            'bar_admissions' => [
                'California State Bar (2009)',
                'New York State Bar (2012)',
                'U.S. Patent and Trademark Office (USPTO Registered)',
                'U.S. Court of Appeals for the Federal Circuit',
            ],
            'education' => [
                'J.D., Stanford Law School',
                'M.S. in Computer Science, MIT',
                'B.S. in Electrical Engineering, UC Berkeley',
            ],
            'social_links' => [
                'linkedin' => 'https://linkedin.com/in/marcus-croft-ip',
                'github' => 'https://github.com/mcroft-legal',
            ],
            'is_active' => true,
        ]);

        $victoria = Attorney::create([
            'name' => 'Hon. Victoria Hayes',
            'slug' => 'victoria-hayes',
            'designation' => 'Partner, White-Collar Defense',
            'email' => 'v.hayes@apexlegal.com',
            'phone' => '+1 (212) 890-4404',
            'photo_url' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800',
            'bio' => 'A former Assistant United States Attorney (AUSA) for the Southern District of New York, Victoria Hayes provides unmatched strategic counsel for individuals and corporations facing federal criminal charges, regulatory sanctions, and congressional inquiries. Victoria’s deep knowledge of prosecutorial tactics allows her to neutralize investigations before indictments are brought.',
            'bar_admissions' => [
                'New York State Bar (2001)',
                'U.S. Supreme Court Bar',
                'U.S. District Court, Southern & Eastern Districts of New York',
                'National Association of Criminal Defense Lawyers (NACDL)',
            ],
            'education' => [
                'J.D., NYU School of Law (Vanderbilt Scholar)',
                'B.A. in Political Science, Georgetown University',
            ],
            'social_links' => [
                'linkedin' => 'https://linkedin.com/in/victoria-hayes-counsel',
            ],
            'is_active' => true,
        ]);

        // 4. Attach Attorneys to Practice Areas
        $jonathan->practiceAreas()->sync([$corporate->id, $antitrust->id, $realEstate->id]);
        $eleanor->practiceAreas()->sync([$personalInjury->id, $medMal->id, $employment->id]);
        $marcus->practiceAreas()->sync([$ipLaw->id, $corporate->id]);
        $victoria->practiceAreas()->sync([$whiteCollar->id, $corporate->id, $employment->id]);

        // 5. Seed Case Results / Verdicts
        CaseResult::create([
            'title' => 'Cross-Border Semiconductor Acquisition Clearance & Antitrust Immunity',
            'slug' => 'semiconductor-acquisition-clearance',
            'settlement_verdict' => '$1.2B Transaction Clearance',
            'practice_area_id' => $corporate->id,
            'lead_attorney_id' => $jonathan->id,
            'summary' => 'Secured unconditional FTC and international regulatory clearance for a major tech merger involving competing semiconductor design patents against extensive third-party market opposition.',
            'case_year' => 2024,
        ]);

        CaseResult::create([
            'title' => 'Commercial Trucking Multi-Vehicle Highway Collision Verdict',
            'slug' => 'commercial-trucking-collision-verdict',
            'settlement_verdict' => '$14,250,000 Jury Verdict',
            'practice_area_id' => $personalInjury->id,
            'lead_attorney_id' => $eleanor->id,
            'summary' => 'Won landmark jury verdict against an interstate freight carrier whose driver violated federal hours-of-service regulations, causing traumatic brain injury to our client.',
            'case_year' => 2023,
        ]);

        CaseResult::create([
            'title' => 'Global SaaS Trade Secret Misappropriation & Injunction Recovery',
            'slug' => 'saas-trade-secret-injunction-recovery',
            'settlement_verdict' => '$22,400,000 Recovery & Injunction',
            'practice_area_id' => $ipLaw->id,
            'lead_attorney_id' => $marcus->id,
            'summary' => 'Obtained emergency federal TRO and permanent injunction along with $22.4M settlement for an enterprise AI company after former executives exfiltrated proprietary neural weighting models.',
            'case_year' => 2024,
        ]);

        CaseResult::create([
            'title' => 'Federal SEC Securities Fraud Investigation Total Declination',
            'slug' => 'sec-securities-fraud-declination',
            'settlement_verdict' => 'Complete Investigation Dismissal',
            'practice_area_id' => $whiteCollar->id,
            'lead_attorney_id' => $victoria->id,
            'summary' => 'Persuaded the Department of Justice and Securities & Exchange Commission to decline criminal and civil prosecution against the Chief Financial Officer of a publicly traded fintech entity.',
            'case_year' => 2023,
        ]);

        CaseResult::create([
            'title' => 'Hospital Surgical Failure & Anesthesia Oxygen Deprivation Settlement',
            'slug' => 'hospital-surgical-failure-settlement',
            'settlement_verdict' => '$8,500,000 Structured Settlement',
            'practice_area_id' => $medMal->id,
            'lead_attorney_id' => $eleanor->id,
            'summary' => 'Negotiated lifetime medical trust and multi-million dollar cash settlement for a family affected by severe hypoxia during an elective orthopedic surgery at a regional hospital center.',
            'case_year' => 2022,
        ]);

        CaseResult::create([
            'title' => 'Downtown Commercial Tower Mixed-Use Zoning Dispute & Land Assembly',
            'slug' => 'downtown-tower-zoning-land-assembly',
            'settlement_verdict' => '$68,000,000 Entitlement Value',
            'practice_area_id' => $realEstate->id,
            'lead_attorney_id' => $jonathan->id,
            'summary' => 'Successfully defeated municipal zoning challenge and secured variance approvals enabling construction of a 42-story LEED Platinum commercial development.',
            'case_year' => 2024,
        ]);

        CaseResult::create([
            'title' => 'Tech Executive Unlawful Termination & Golden Parachute Arbitration',
            'slug' => 'tech-executive-severance-arbitration',
            'settlement_verdict' => '$5,100,000 Arbitration Award',
            'practice_area_id' => $employment->id,
            'lead_attorney_id' => $victoria->id,
            'summary' => 'Prevailed before AAA arbitration panel securing full severance acceleration, stock option vesting, and reputational damages for an unjustly terminated Chief Technology Officer.',
            'case_year' => 2023,
        ]);

        // 6. Seed Sample Consultation Leads
        ConsultationLead::create([
            'full_name' => 'Alexander Wright',
            'email' => 'a.wright@techdynamics.io',
            'phone' => '+1 (555) 234-8901',
            'practice_area_id' => $corporate->id,
            'case_details' => 'We are preparing for a $45M Series B funding round with cross-border European investors and need comprehensive counsel on restructuring voting equity and IP assignments.',
            'status' => 'contacted',
            'source' => 'website',
        ]);

        ConsultationLead::create([
            'full_name' => 'Sophia Martinez',
            'email' => 'smartinez@email.com',
            'phone' => '+1 (555) 432-1098',
            'practice_area_id' => $personalInjury->id,
            'case_details' => 'My spouse was struck by a commercial delivery van on Interstate 87 last week and is currently in intensive care with fractures and head trauma. The insurer has reached out.',
            'status' => 'scheduled',
            'source' => 'website',
        ]);

        ConsultationLead::create([
            'full_name' => 'Dr. Robert Chen',
            'email' => 'rchen@biotrial.org',
            'phone' => '+1 (555) 987-6543',
            'practice_area_id' => $ipLaw->id,
            'case_details' => 'Competitor has filed a patent infringement complaint with the ITC regarding our diagnostic antibody sequencing process. Need emergency trial evaluation.',
            'status' => 'pending',
            'source' => 'website',
        ]);

        ConsultationLead::create([
            'full_name' => 'David Sterling-Miller',
            'email' => 'd.miller@capinvest.com',
            'phone' => '+1 (555) 765-4321',
            'practice_area_id' => $whiteCollar->id,
            'case_details' => 'Received formal subpoena duces tecum from federal regulators regarding 2022 accounting disclosures. Requesting urgent confidential consultation.',
            'status' => 'pending',
            'source' => 'website',
        ]);
    }
}
