#!/bin/bash

# Fix all imports to add .svelte.ts extension

cd "F:\_CIRQUE AFLAME\_CODE\ringmaster"

# Find all .svelte and .ts files and fix imports
find src -type f \( -name "*.svelte" -o -name "*.ts" \) | while read file; do
  sed -i "s|from '\$lib/state/events'|from '\$lib/state/events.svelte.ts'|g" "$file"
  sed -i "s|from '\$lib/state/clients'|from '\$lib/state/clients.svelte.ts'|g" "$file"
  sed -i "s|from '\$lib/state/performers'|from '\$lib/state/performers.svelte.ts'|g" "$file"
  sed -i "s|from '\$lib/state/tasks'|from '\$lib/state/tasks.svelte.ts'|g" "$file"
  sed -i "s|from '\$lib/state/theme'|from '\$lib/state/theme.svelte.ts'|g" "$file"
  sed -i "s|from '\$lib/state/agents'|from '\$lib/state/agents.svelte.ts'|g" "$file"

  sed -i 's|from "\$lib/state/events"|from "\$lib/state/events.svelte.ts"|g' "$file"
  sed -i 's|from "\$lib/state/clients"|from "\$lib/state/clients.svelte.ts"|g' "$file"
  sed -i 's|from "\$lib/state/performers"|from "\$lib/state/performers.svelte.ts"|g' "$file"
  sed -i 's|from "\$lib/state/tasks"|from "\$lib/state/tasks.svelte.ts"|g' "$file"
  sed -i 's|from "\$lib/state/theme"|from "\$lib/state/theme.svelte.ts"|g' "$file"
  sed -i 's|from "\$lib/state/agents"|from "\$lib/state/agents.svelte.ts"|g' "$file"

  # Fix double extensions
  sed -i "s|.svelte.ts.svelte.ts|.svelte.ts|g" "$file"
  sed -i "s|theme.svelte.svelte.ts|theme.svelte.ts|g" "$file"
done

echo "Import fixes completed!"
