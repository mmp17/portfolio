# Muzaffar Mirzaev — Portfolio

Personal portfolio site of Muzaffar Mirzaev, Ph.D., Principal Software Engineer working on robotics
and industrial AI: AMR control systems, ROS 2, digital twins and smart-factory software.

**Live site:** https://mmp17.github.io/portfolio/

## Pages

| Page | Path | Content |
| --- | --- | --- |
| Home | `index.html` | Introduction, focus areas and activity timeline |
| Projects | `projects/index.html` | Robotics and digital twin, smart factory and AI, web applications, earlier projects |
| Experience | `experience/index.html` | Work history, education, core technologies, languages |
| Blog | `blog/index.html` | YouTube podcasts, IT articles, personal posts (tabs) |
| Resume | `resume/index.html` | Resume and portfolio links, contact details, map |

`cv/index.html` only redirects the old address to `resume/`.

## Stack

Plain HTML, CSS and JavaScript. There is no build step and no dependencies.

```
index.html
projects/  experience/  blog/  resume/   one index.html each
blog/articles/_template.html    starting point for an IT article
assets/css/style.css            single stylesheet, responsive
assets/js/site.js               mobile menu, Follow toggle, blog tabs, photo carousel, email link
images/                         avatar, favicon and blog photos
```

The header, sidebar, footer and the metadata in `<head>` are repeated in every HTML file, so a
change to them has to be made in each one.

## Adding content

- **IT article:** copy `blog/articles/_template.html` to `blog/articles/<slug>.html` and follow the
  comment at the top of its `<main>`. Then link it from the IT tab in `blog/index.html`.
- **Podcast episode:** copy the commented episode template above the list in the podcasts tab of
  `blog/index.html` and append it to the list.
- **Personal post:** put the photos in `images/blog/<slug>/` and a 480 px copy of each in
  `images/blog/<slug>/thumbs/`. The page shows the thumbnails and the carousel opens the originals.

  ```bash
  cd images/blog/<slug> && mkdir -p thumbs
  for f in *.jpg; do sips -Z 480 -s formatOptions 55 "$f" --out "thumbs/$f"; done
  ```
- **Project status:** the status labels on the Projects page are documented in a comment above the
  AMR Control System entry.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Deployment

The site is served by GitHub Pages from the root of the `develop` branch. Pushing to `develop`
publishes the change within a minute or two.

## Credits

- Layout modelled on the [AcademicPages](https://github.com/academicpages/academicpages.github.io) theme.
- Icons from [Feather](https://feathericons.com/) (MIT).

## Contact

- GitHub: [mmp17](https://github.com/mmp17)
- LinkedIn: [mirzaevmuzaffar](https://www.linkedin.com/in/mirzaevmuzaffar/)
