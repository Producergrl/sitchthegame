

## Colour Refresh — Bright, Fun & Slick

### Current issues
The hero uses a flat `bg-[#f98c06]` orange with near-black text (`#020b1d`, `#050b52`, `#080c5e`, `#050f24`). The contrast is harsh, the palette feels monotone, and the dark hardcoded blues clash with the orange rather than complementing it.

### New palette direction
A warm amber-gold background paired with a rich indigo-blue for text and accents, using lighter tints and subtle gradients to keep it polished and kid-friendly:

| Role | Colour | Usage |
|------|--------|-------|
| Hero bg | `#FDB913` → `#F7941D` gradient | Warm gold-to-amber, energetic but not flat |
| Primary text | `#1E3A5F` | Deep navy — readable, not harsh |
| Subtitle text | `#2D5F8A` | Medium slate-blue — softer secondary |
| XP / minor text | `#1E3A5F` | Consistent with primary |
| Shield emblem bg | `#1E3A5F` → `#2D5F8A` gradient | Rich navy, matches text |
| Quick Play btn | `#1E3A5F` → `#2D5F8A` gradient | Navy button, cream text |
| Custom Game btn | White bg with navy text + border | Clean secondary CTA |
| Level badge border | `#1E3A5F / 0.15` | Subtle navy outline |
| Scroll indicator | `#1E3A5F / 0.35` | Gentle navy |
| Page body gradient | `#FEF3D0` → `#FFF8E7` | Warm cream below the fold |
| Nav cards | White bg, navy border/shadow tints | Clean, elevated |
| Safety badge | Navy tint bg | Consistent |

### Changes (single file: `src/pages/Index.tsx`)

1. **Hero background** (line 65): Replace flat `bg-[#f98c06]` with a radial gradient from `#FDB913` to `#F7941D`
2. **Page body** (line 58): Update outer gradient to warm cream tones
3. **Particle colour** (line 19): Shift to navy `hsl(215 60% 30%)`
4. **Glow aura** (lines 93-96): Navy-gold pulsing glow
5. **Shield emblem** (lines 112-113): Navy gradient `#1E3A5F` → `#2D5F8A`
6. **Title gradient** (line 139): Rich navy gradient `#1E3A5F` → `#2D5F8A` → `#1E3A5F`
7. **"Founders Edition"** (line 152): `text-[#050b52]` → `text-[#2D5F8A]`
8. **Tagline** (line 172): `text-[#080c5e]` → `text-[#2D5F8A]`
9. **Level badge** (lines 186-194): Navy border/text to `#1E3A5F`
10. **XP text** (line 194): `text-[#050f24]` → `text-[#1E3A5F]`
11. **Quick Play button** (lines 209-211): Navy gradient, warm cream text
12. **Custom Game button** (line 221): White bg, navy text, navy border — clean secondary
13. **Scroll indicator** (lines 239, 244): Navy at 35% opacity
14. **Below-fold cards & badge** (lines 275-309): Navy-tinted borders/shadows
15. **Metallic underline** (line 164): Navy accent line

No other files need changes — all hardcoded hex values are confined to `Index.tsx`.

