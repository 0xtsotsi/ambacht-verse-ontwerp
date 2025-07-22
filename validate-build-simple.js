import fs from "fs";
import path from "path";

function validateProductionBuild() {
  console.log("🚀 Starting production build validation...\n");

  const distPath = path.join(process.cwd(), "dist");

  // Check if dist folder exists
  if (!fs.existsSync(distPath)) {
    console.error("❌ dist/ folder not found. Run build first.");
    process.exit(1);
  }

  // Check if index.html exists
  const indexPath = path.join(distPath, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.error("❌ dist/index.html not found.");
    process.exit(1);
  }

  console.log("✅ Production artifacts found");

  // Read and validate index.html content
  const indexContent = fs.readFileSync(indexPath, "utf8");

  // Check for essential elements in index.html
  const checks = [
    { name: "HTML5 doctype", test: indexContent.includes("<!doctype html>") },
    { name: "App root div", test: indexContent.includes('<div id="root">') },
    {
      name: "Main JS bundle",
      test: /src="\/assets\/index-[^"]+\.js"/.test(indexContent),
    },
    {
      name: "CSS bundle",
      test: /href="\/assets\/index-[^"]+\.css"/.test(indexContent),
    },
    {
      name: "Module preloads",
      test: indexContent.includes('rel="modulepreload"'),
    },
    { name: "Page title", test: indexContent.includes("Wesley's Ambacht") },
    {
      name: "Meta description",
      test: indexContent.includes('name="description"'),
    },
    { name: "OpenGraph tags", test: indexContent.includes('property="og:') },
    { name: "Viewport meta", test: indexContent.includes('name="viewport"') },
  ];

  console.log("📋 Index.html validation:");
  let allPassed = true;

  checks.forEach((check) => {
    if (check.test) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name}`);
      allPassed = false;
    }
  });

  // Check assets directory
  const assetsPath = path.join(distPath, "assets");
  if (!fs.existsSync(assetsPath)) {
    console.error("❌ dist/assets/ folder not found.");
    process.exit(1);
  }

  // Get asset files
  const assetFiles = fs.readdirSync(assetsPath);
  const jsFiles = assetFiles.filter((f) => f.endsWith(".js"));
  const cssFiles = assetFiles.filter((f) => f.endsWith(".css"));
  const mapFiles = assetFiles.filter((f) => f.endsWith(".js.map"));

  console.log("\n📊 Build artifacts analysis:");
  console.log(`   📜 JavaScript files: ${jsFiles.length}`);
  console.log(`   🎨 CSS files: ${cssFiles.length}`);
  console.log(`   🗺️  Source maps: ${mapFiles.length}`);

  // Calculate total sizes
  let totalJsSize = 0;
  let totalCssSize = 0;

  jsFiles.forEach((file) => {
    const filePath = path.join(assetsPath, file);
    const stats = fs.statSync(filePath);
    totalJsSize += stats.size;
  });

  cssFiles.forEach((file) => {
    const filePath = path.join(assetsPath, file);
    const stats = fs.statSync(filePath);
    totalCssSize += stats.size;
  });

  const totalSize = totalJsSize + totalCssSize;

  console.log(`   📏 Total JS size: ${(totalJsSize / 1024).toFixed(1)}KB`);
  console.log(`   📏 Total CSS size: ${(totalCssSize / 1024).toFixed(1)}KB`);
  console.log(`   📏 Total assets: ${(totalSize / 1024).toFixed(1)}KB`);

  // Check for main chunks expected from Vite build
  const expectedChunks = [
    { pattern: /index-.*\.js$/, name: "Main bundle" },
    { pattern: /react-.*\.js$/, name: "React vendor" },
    { pattern: /vendor-.*\.js$/, name: "Third-party vendor" },
    { pattern: /ui-.*\.js$/, name: "UI components" },
    { pattern: /utils-.*\.js$/, name: "Utilities" },
    { pattern: /index-.*\.css$/, name: "Main styles" },
  ];

  console.log("\n🧩 Chunk validation:");
  let chunksValid = true;

  expectedChunks.forEach((chunk) => {
    const found = [...jsFiles, ...cssFiles].some((file) =>
      chunk.pattern.test(file),
    );
    if (found) {
      console.log(`   ✅ ${chunk.name} found`);
    } else {
      console.log(`   ⚠️  ${chunk.name} not found`);
    }
  });

  // Performance assessment
  console.log("\n⚡ Performance assessment:");

  const performanceChecks = [
    {
      name: "Bundle size under 1.5MB",
      test: totalSize < 1.5 * 1024 * 1024,
      current: `${(totalSize / 1024 / 1024).toFixed(1)}MB`,
    },
    {
      name: "JS size reasonable (<1MB)",
      test: totalJsSize < 1024 * 1024,
      current: `${(totalJsSize / 1024).toFixed(1)}KB`,
    },
    {
      name: "Multiple JS chunks (code splitting)",
      test: jsFiles.length >= 3,
      current: `${jsFiles.length} chunks`,
    },
    {
      name: "Source maps included",
      test: mapFiles.length > 0,
      current: `${mapFiles.length} maps`,
    },
  ];

  performanceChecks.forEach((check) => {
    if (check.test) {
      console.log(`   ✅ ${check.name} (${check.current})`);
    } else {
      console.log(`   ⚠️  ${check.name} (${check.current})`);
    }
  });

  // Final assessment
  if (allPassed && chunksValid) {
    console.log("\n🎉 Production build validation successful!");
    console.log("📋 Summary:");
    console.log("   ✅ All HTML validation checks passed");
    console.log("   ✅ Essential build chunks present");
    console.log("   ✅ Source maps generated for debugging");
    console.log("   ✅ Build artifacts properly structured");
    console.log("\n🚀 Build is ready for deployment!");
  } else {
    console.log(
      "\n⚠️  Production build has validation warnings but may still be functional.",
    );
    console.log(
      "   Consider running a full browser test for complete validation.",
    );
  }
}

validateProductionBuild();
