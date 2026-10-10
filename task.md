# LuxGrowth AI
Approved: screenshot recreation, French + Portuguese, full web platform.
Scope: marketing, Better Auth Google/email, protected dashboard, real HTML audit (not traffic analytics), CRM CRUD, saved enquiries, Autumn sandbox subscriptions.
API: audit.run/history, leads.list/create/update/remove, enquiries.create, billing.customer/checkout/portal.
DB: auth tables, audits, leads, enquiries. Packages: web only.
Plan: setup auth/billing schema -> implement API -> screenshot UI + bilingual flows -> build/test/deliver.
Payments: supplied key verified Sandbox. Need production key and Stripe before real-money activation. Never claim real payments active.
Completed: marketing bilingual, auth email + managed Google configured, protected dashboard, persisted HTML audits with quotas, CRM create/edit/delete/CSV, persisted contact enquiries, 7 Autumn plans, Stripe sandbox checkout and portal integration.
Verified: build/lint, email registration/login, real example.com audit, saved history, CRM full CRUD and CSV, enquiry submission, Stripe checkout URL, responsive widths and no runtime errors.
Limitations: Autumn organization defaults USD; attempted EUR rejected `Multi-currency is not enabled for this organization`. Visible notice: catalogue EUR indicative, sandbox checkout 99/149/199 USD. Production requires EUR configuration, live key, final company/legal details. Google configured but full external account authorization not tested. No email notifications/admin inbox; enquiries persist in DB. Automated marketing/website delivery are service descriptions, not implemented campaign automation or a website builder.
