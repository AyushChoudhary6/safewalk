$content = Get-Content src/services/mapsService.ts -Raw
$content = $content -replace '(?s)const fetchPromise = \(async \(\) => {.*?const data = await response\.json\(\);.*?return data;.*?}\)\(\);', 'const fetchPromise = (async () => {
        const response = await fetch(url);
        if (!response.ok) {
          const text = await response.text();
          throw new Error("HTTP " + response.status + ": " + text.substring(0, 100));
        }
        return await response.json();
      })();'
Set-Content src/services/mapsService.ts -Value $content
