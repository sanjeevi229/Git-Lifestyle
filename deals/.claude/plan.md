# Shopping Flow: Add Product Detail Page with Add to Cart

## Current Flow (3 steps)
1. **Browse Items** → select item → 2. **Order Details** → 3. **Confirmation**

## New Flow (4 steps)
1. **Browse Items** — category pills + item grid (unchanged)
2. **Product Detail** (NEW) — after clicking an item:
   - Large product image
   - Product name, price, category
   - Merchant info (revealed here now)
   - Discount badge if applicable
   - **"Add to Cart"** button (proceeds to checkout)
   - **"You May Also Like"** section — shows 4 similar items from the same subcategory (excluding current item), clickable to switch product
3. **Checkout** — order form (delivery, qty, promo, special requests, card info) with the selected item summary at top
4. **Confirmation** — review & confirm (same as current step 3)

## Files to Change

### 1. `shopping-booking.js`
- Update progress bar from 3 to 4 steps: Select Item → Product Info → Checkout → Confirmation
- Add `_renderStep2ProductDetail()` — new product detail page
- Rename current `_renderStep2()` → becomes step 3 (checkout)
- Rename current `_renderStep3()` → becomes step 4 (confirmation)
- Update mount() event delegation:
  - Item card click → goes to step 2 (product detail) instead of order form
  - "Add to Cart" button → goes to step 3 (checkout)
  - Similar item click → updates selected item, re-renders step 2
  - Back from checkout → goes to step 2 (product detail)
- Update sticky CTA labels for 4 steps

### 2. `booking.css`
- Add styles for product detail layout:
  - `.booking-product-detail` — main container
  - `.booking-product-hero` — large image
  - `.booking-product-info` — name, price, category
  - `.booking-product-actions` — Add to Cart button
  - `.booking-similar-items` — "You May Also Like" section with horizontal scroll or grid
- Responsive adjustments

### 3. `index.html`
- Bump cache versions for changed files
