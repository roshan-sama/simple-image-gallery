## Simple Image Gallery
Organize your image files into galleries

## Features
1. Responsive Grid Layout:

- Uses CSS Grid with auto-fill and minmax for responsive columns
- Square aspect ratio maintained for all images
- Smooth hover effects with subtle zoom animation

2. Modal View:

- Full-screen modal for enlarged images
- Navigation controls (prev/next buttons)
- Keyboard navigation (arrow keys, ESC to close)
- Smooth transitions and dark overlay
- Maintains image aspect ratio while maximizing viewport usage

3. Collection Management:

- Dropdown selector for different image collections
- JSON-based collection management (similar to playlists)
- Lazy loading of images for better performance
- Graceful error handling for missing images

4. Offline Support:

- Service Worker caches both static assets and images
- Offline indicator when connection is lost
- Stale-while-revalidate strategy for HTML/JSON
- Efficient image caching with format support for jpg, jpeg, png, gif, and webp

5. UX Features:

- Loading indicators during image/collection loads
- Error messages with auto-dismiss
- Responsive design that works on mobile and desktop
- Clear visual feedback for user interactions

6. Performance Optimizations:

- Lazy loading using native loading="lazy" attribute
- Efficient image caching in Service Worker
- Minimal dependencies (just Tailwind CSS)
- Optimized event listeners and DOM operations

## Deployment

Replace template strings in gallery.html and sw.js
> const fqdn = "##fqdn##";
> const path = "##path##";

and host them at https://${fqdn}/${path}/gallery.html and https://${fqdn}/${path}/sw.js respectively

1. Download the entire tailwind css bundle from their cdn and host at https://${fqdn}/${path}/tailwind.css 
2. Create a collections.json file listing your collections, and host at https://${fqdn}/${path}/collections.json
3. Create individual collection JSON files (e.g., https://${fqdn}/${path}/vacation.json, https://${fqdn}/${path}/portraits.json) 

Structure your collections JSON files as arrays of image filenames:
> ["image1.jpg", "image2.png", "sunset.webp"]

sw.js will attempt to cache your images locally when they are loaded. You should be able to disable this by modifying your browser settings

## Notes
Provided the simple-audio-player repository's playlist.html and sw.js files as inputs to Claude, and asked it for something like the audio player but for images

It generated gallery.html and sw.js

Then, asked it to add the image title in the modal. 

That's it. Done in two prompts

## Roadmap
- Focus mode to hide all UI elements when in modal view (hide title, left, right and close buttons)
- Slideshow mode to automatically move between elements
- Larger area for left and right buttons (maybe pair with focus mode where tapping left and right edges of screen changes images)

