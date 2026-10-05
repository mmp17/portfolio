# Muzaffar Mirzaev — Portfolio

Personal portfolio site of Muzaffar Mirzaev, Ph.D., a software engineer working on digital twins,
autonomous mobile robots, AI vision and smart-factory systems.

**Live site:** https://mmp17.github.io/portfolio/

## Pages

| Page | Path | Content |
| --- | --- | --- |
| Home | `index.html` | Introduction and activity timeline |
| Projects | `projects/index.html` | Robotics and digital twin, smart factory and AI, web applications |
| Experience | `experience/index.html` | Work history, education, core technologies, languages |
| CV | `cv/index.html` | Resume and portfolio links, contact details, map |

## Stack

Plain HTML, CSS and JavaScript. There is no build step and no dependencies.

```
index.html
projects/  experience/  cv/     one index.html each
assets/css/style.css            single stylesheet, responsive
assets/js/site.js               mobile menu, Follow toggle, email link
images/                         avatar and favicon
```

The header, sidebar and footer are repeated in each of the four HTML files, so a change to them has
to be made in all four.

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
