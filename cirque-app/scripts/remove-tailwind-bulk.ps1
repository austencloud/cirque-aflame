# PowerShell script to bulk remove Tailwind classes from .svelte files

Write-Host "🔧 Bulk Tailwind Removal Script" -ForegroundColor Cyan
Write-Host "==============================`n" -ForegroundColor Cyan

$rootPath = "F:\_CIRQUE AFLAME\_CODE\cirque-app\src"
$filesProcessed = 0
$classesRemoved = 0

# Common Tailwind patterns to remove
$tailwindPatterns = @(
    # Responsive and state prefixes
    'sm:', 'md:', 'lg:', 'xl:', '2xl:',
    'hover:', 'focus:', 'active:', 'disabled:',
    'dark:', 'group-hover:',

    # Layout utilities with values
    'max-w-\w+', 'min-w-\w+', 'w-\d+', 'w-full', 'w-auto',
    'h-\d+', 'h-full', 'h-auto',

    # Spacing utilities
    'p-\d+', 'px-\d+', 'py-\d+', 'pt-\d+', 'pb-\d+', 'pl-\d+', 'pr-\d+',
    'm-\d+', 'mx-\d+', 'my-\d+', 'mt-\d+', 'mb-\d+', 'ml-\d+', 'mr-\d+',
    'space-x-\d+', 'space-y-\d+', 'gap-\d+',

    # Display
    'block', 'inline-block', 'inline', 'flex', 'inline-flex', 'grid', 'inline-grid', 'hidden',

    # Flexbox
    'flex-row', 'flex-col', 'flex-wrap', 'flex-nowrap',
    'items-start', 'items-center', 'items-end', 'items-stretch',
    'justify-start', 'justify-center', 'justify-end', 'justify-between', 'justify-around',
    'flex-1', 'flex-auto', 'flex-initial', 'flex-none',

    # Grid
    'grid-cols-\d+', 'grid-rows-\d+', 'col-span-\d+', 'row-span-\d+',

    # Colors
    'bg-\w+-\d+', 'text-\w+-\d+', 'border-\w+-\d+',

    # Typography
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl',
    'font-thin', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold',
    'text-left', 'text-center', 'text-right',
    'uppercase', 'lowercase', 'capitalize',
    'truncate', 'whitespace-\w+',

    # Borders
    'border', 'border-\d+', 'border-t', 'border-r', 'border-b', 'border-l',
    'rounded', 'rounded-\w+',

    # Effects
    'shadow', 'shadow-\w+',
    'opacity-\d+',

    # Transitions
    'transition', 'duration-\d+', 'ease-\w+',

    # Positioning
    'relative', 'absolute', 'fixed', 'sticky',
    'inset-\d+', 'top-\d+', 'right-\d+', 'bottom-\d+', 'left-\d+',

    # Overflow
    'overflow-\w+', 'overflow-x-\w+', 'overflow-y-\w+',

    # Outline & Ring
    'outline-\w+', 'ring-\d+', 'ring-\w+-\d+',

    # Cursor
    'cursor-\w+',
    'pointer-events-\w+'
)

function Remove-TailwindClasses {
    param (
        [string]$FilePath
    )

    $content = Get-Content $FilePath -Raw
    $originalContent = $content
    $localClassesRemoved = 0

    # Pattern to match class attributes
    $classPattern = 'class="([^"]*)"'

    $content = [regex]::Replace($content, $classPattern, {
        param($match)

        $classes = $match.Groups[1].Value
        $originalClasses = $classes

        # Remove each Tailwind pattern
        foreach ($pattern in $tailwindPatterns) {
            $classes = $classes -replace "\b$pattern\b", ''
        }

        # Clean up extra whitespace
        $classes = $classes -replace '\s+', ' '
        $classes = $classes.Trim()

        # Count removed classes
        $originalCount = ($originalClasses -split '\s+').Count
        $newCount = ($classes -split '\s+' | Where-Object { $_ -ne '' }).Count
        $script:classesRemoved += ($originalCount - $newCount)

        # Return cleaned class attribute
        if ($classes) {
            return "class=`"$classes`""
        } else {
            return ''  # Remove empty class attribute
        }
    })

    # Only write if changes were made
    if ($content -ne $originalContent) {
        Set-Content $FilePath $content -NoNewline
        return $true
    }

    return $false
}

# Find all .svelte files
$svelteFiles = Get-ChildItem -Path $rootPath -Filter *.svelte -Recurse

Write-Host "Found $($svelteFiles.Count) .svelte files`n" -ForegroundColor Yellow

foreach ($file in $svelteFiles) {
    $relativePath = $file.FullName.Substring($rootPath.Length)

    if (Remove-TailwindClasses -FilePath $file.FullName) {
        Write-Host "✓ Processed: $relativePath" -ForegroundColor Green
        $filesProcessed++
    }
}

Write-Host "`n==============================" -ForegroundColor Cyan
Write-Host "Files processed: $filesProcessed" -ForegroundColor Green
Write-Host "Classes removed: $classesRemoved" -ForegroundColor Green
Write-Host "`nNote: You'll need to add semantic CSS classes and styles to maintain visual appearance." -ForegroundColor Yellow
