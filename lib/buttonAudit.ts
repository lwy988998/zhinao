/**
 * Button Audit Utility
 *
 * Rules for all visible buttons in the zhinao project:
 *
 * 1. Every visible `<button>` or button-styled element MUST have an onClick
 *    or be inside a `<form>` with onSubmit, or be wrapped in a `<Link>`.
 *
 * 2. No `<button type="button">` without an onClick handler allowed.
 *    Exception: buttons inside interactive components that are rendered
 *    conditionally must still have a default action (copy/scroll/modal).
 *
 * 3. `<button type="submit">` is OK inside `<form>` elements.
 *
 * 4. Buttons styled as links must be `<Link>` tags, not `<button>`.
 *
 * 5. All icon-only buttons must have `aria-label` or `title`.
 *
 * 6. All buttons must have cursor-pointer and active state.
 *
 * 7. Buttons that only show static info should be `<span>` not `<button>`.
 *
 * 8. Every button click must produce visible feedback (state change, toast,
 *    scroll, navigation, modal open/close, copy confirmation).
 *
 * ── Known Button Types and Their Required Actions ──
 *
 * navigate      → Link / router.push         (must navigate)
 * toggle        → useState setter              (must toggle state)
 * open_modal    → setOpen(true)                (must open modal)
 * close_modal   → setOpen(false)               (must close modal)
 * copy          → navigator.clipboard.writeText (must copy + toast)
 * scroll_to     → el.scrollIntoView            (target must exist)
 * save          → fetch POST                   (must persist data)
 * publish       → fetch POST /api/publish      (must publish)
 * refresh       → re-fetch / reload            (must refresh UI)
 * form_submit   → form onSubmit                (must submit form)
 */

/** Check-list for manual button audit of each component:
 *
 * □ app/page.tsx
 *   □ Sidebar nav links                    → navigate / scroll / toast ✅
 *   □ Toolbar icon buttons                 → onClick focus+hint ✅
 *   □ Mode toggle pills                    → setActiveMode ✅
 *   □ Submit button                        → form submit ✅
 *   □ Quick tag buttons                    → setPrompt ✅
 *   □ Example buttons                      → setPrompt ✅
 *
 * □ app/generate/page.tsx
 *   □ Back to home Link                    → navigate ✅
 *   □ Logo Link                            → navigate ✅
 *   □ Selector options                     → onChange ✅
 *   □ "生成网页" submit button             → loading+submit ✅
 *
 * □ app/editor/page.tsx
 *   □ "去生成网页" Link                    → navigate ✅
 *   □ "重新生成" Link                      → navigate ✅
 *
 * □ components/editor/PageEditor.tsx
 *   □ "发布页面" button                    → fetch publish ✅
 *   □ "保存修改" button                    → fetch save ✅
 *   □ "复制公开链接" button               → clipboard ✅
 *   □ "打开公开页面" link                  → navigate ✅
 *   □ "继续编辑" button                    → toggle state ✅
 *   □ Collapsible buttons                  → toggle ✅
 *   □ Section visibility toggle            → toggle ✅
 *   □ Section move up/down                 → move ✅
 *
 * □ components/interactive/InteractiveTabs.tsx
 *   □ Tab switch buttons                   → setActive ✅
 *   □ Action button                        → copy / onAction ✅
 *
 * □ components/interactive/InteractiveAccordion.tsx
 *   □ Expand/collapse buttons              → toggle ✅
 *   □ Action button                        → copy / onAction ✅
 *
 * □ components/interactive/InteractiveCarousel.tsx
 *   □ Prev/Next buttons                    → setActive ✅
 *   □ Dot navigation                       → setActive ✅
 *
 * □ components/interactive/InteractiveModal.tsx
 *   □ Trigger button                       → setOpen(true) ✅
 *   □ Close (X) button                     → setOpen(false) ✅
 *   □ Backdrop close                       → setOpen(false) ✅
 *   □ ESC close                            → setOpen(false) ✅
 *   □ Action button                        → copy / onAction ✅
 *
 * □ components/sections/HeroSectionView.tsx
 *   □ Primary CTA button                   → scroll_to / modal ✅
 *   □ Secondary button                     → scroll_to ✅
 *
 * □ components/sections/CTASectionView.tsx
 *   □ CTA button (all layouts)             → scroll_to / modal ✅
 *
 * □ components/sections/FeaturesSectionView.tsx
 *   → delegates to Interactive* ✅
 *
 * □ components/sections/TestimonialsSectionView.tsx
 *   → delegates to Interactive* ✅
 *
 * □ components/sections/FAQSectionView.tsx
 *   → delegates to InteractiveAccordion / native <details> ✅
 *
 * □ components/appBlocks/AppPreviewSectionView.tsx
 *   □ View switch buttons                  → setActive ✅
 *
 * □ components/appBlocks/DashboardSectionView.tsx
 *   (no interactive buttons, display-only) ✅
 *
 * □ components/appBlocks/AppShellPreview.tsx
 *   □ Nav buttons (scroll-to-section)      → scrollIntoView ✅
 *
 * □ app/edit/[editToken]/page.tsx
 *   □ "返回首页" Link                      → navigate ✅
 *   □ "进入编辑器" Link                    → navigate ✅
 *
 * □ app/p/[pageId]/page.tsx
 *   (no user buttons) ✅
 */

export {};
