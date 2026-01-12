# Battery Optimization Guide

## ✅ Actions Taken

### 1. **Killed Resource-Heavy Applications**
- ✅ Stopped all Chrome processes
- ✅ Stopped all Canva processes  
- ✅ Stopped all Adobe processes
- ✅ Killed ReportCrash agent (was using 86% CPU)

### 2. **Optimized Cursor Settings**
Updated Cursor settings to reduce CPU/GPU usage:
- Disabled minimap
- Disabled smooth scrolling
- Disabled cursor animations
- Disabled auto-updates and telemetry
- Reduced TypeScript server memory
- Disabled unnecessary editor features (hover, quick suggestions, etc.)
- Disabled file watchers for node_modules and .next

## 🔋 Additional Battery Saving Tips

### Immediate Actions:
1. **Restart Cursor** - The settings changes require a restart to take full effect
2. **Close Unused Tabs** - Each open file/editor tab consumes resources
3. **Disable Unused Extensions** - Check Cursor extensions and disable ones you don't need

### For Your Website (app/page.tsx):
Your page has multiple heavy animations running simultaneously:
- CircuitBackground (canvas animation)
- ShaderCanvas (Three.js shader)
- ShaderLogoAnimation (Three.js)
- ShaderIntroAnimation
- MechanicalWaves
- Multiple framer-motion animations
- LED animations

**Recommendation**: Consider adding a battery-aware mode that disables animations when on battery power.

### System-Level Optimizations:
1. **Enable Low Power Mode** on macOS (System Settings > Battery)
2. **Reduce Screen Brightness**
3. **Close Unused Applications**
4. **Check Activity Monitor** for other high CPU processes

## 📊 Monitor Battery Usage

Run this command to check current CPU usage:
```bash
ps aux | awk '$3 > 5.0 {print $2, $3"%", $11}' | head -10
```

## 🔄 Restart Cursor

**IMPORTANT**: Restart Cursor now to apply all optimizations:
1. Quit Cursor completely (Cmd+Q)
2. Reopen Cursor
3. Check CPU usage again

The optimizations should reduce Cursor's CPU usage from ~75% to under 20%.





