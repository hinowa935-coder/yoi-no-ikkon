# Historical image recovery baseline

- Source production commit: `568eac1430e1dcf7fc5bf2c2c890f5630ed7022e`
- Source production URL: https://yoi-no-ikkon.vercel.app/
- Target site: https://yoi-no-ikkon.netlify.app/
- ACTIVE products at source commit: **484**
- ACTIVE products with formal image records at source commit: **484**
- Historical product-media records outside the ACTIVE set: **4**

This confirms that the historical production state contained a formal-image record for every one of the 484 ACTIVE products.

## Safety

This recovery dataset is **candidate evidence only**. It does not renew `validUntil`, does not convert Vercel approvals into Netlify approvals, and intentionally omits affiliate/image creative URLs and HTML.

Run:

```
node scripts/build-historical-image-recovery-queue.mjs --write
```

against the **latest local Netlify worktree**. It will skip products that already have a current Netlify approval and output only the remaining recovery queue. Any identity/capacity drift is separated for manual review. No approval is created automatically.
