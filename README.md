# Veyl Network Hub

VeylSMP — Full Minecraft Server Website Prompt

Build a complete, professional, modern Minecraft server website for VeylSMP.

The website must have a premium blue + light-blue/cyan design, smooth animations, responsive layouts, a live Minecraft server status system, ranks/store sections, Discord integration, and a secure owner-only admin dashboard.

---

BRAND

Server Name: VeylSMP

Minecraft Server IP / Host:
"veyl.playsmp.lol"

Minecraft Server Port:
"34342"

Server Type:

- Economy
- Survival
- Lifesteal
- Crossplay

The main visual identity must combine:

- Dark blue
- Bright blue
- Light blue
- Cyan
- White
- Dark navy backgrounds

Use subtle blue/cyan glows and gradients.

The website should feel like a premium Minecraft network website, not a generic AI-generated template.

---

HOMEPAGE

Create a beautiful landing page.

Hero

Large centered branding:

VeylSMP

Headline:

SURVIVE. BUILD. DOMINATE.

Subtitle:

An economy survival Minecraft server with Lifesteal and crossplay.

Buttons:

PLAY NOW

JOIN DISCORD

Display the server address prominently:

"veyl.playsmp.lol:34342"

Add a COPY IP button.

When clicked:

IP copied!

---

LIVE SERVER STATUS

Create a large live status card near the top of the homepage.

Display:

SERVER STATUS

🟢 ONLINE

or

🔴 OFFLINE

Then display:

PLAYERS ONLINE

0 / 100

The player count MUST NOT be hardcoded.

It must be retrieved from the actual Minecraft server.

Use a reliable Minecraft server status API/backend integration capable of checking:

- Server online/offline status
- Current players
- Maximum players
- Minecraft version
- MOTD if available
- Server latency if available

The server address is:

"veyl.playsmp.lol:34342"

Automatically refresh the status periodically.

Do NOT refresh every second. Use a sensible interval such as 30–60 seconds depending on the API's rate limits/cache behavior.

If the server status request fails, do NOT show fake player numbers.

Instead display:

Server status unavailable

or

Offline

The UI should have a smooth animated status indicator.

Example:

🟢 Server Online
24 Players Online

---

SERVER CONNECTION CARD

Create a dedicated card showing:

JAVA EDITION

IP:

"veyl.playsmp.lol"

Port:

"34342"

Full Address:

"veyl.playsmp.lol:34342"

Button:

COPY SERVER IP

---

BEDROCK / CROSSPLAY

Because VeylSMP supports crossplay, clearly communicate that Java and Bedrock players can play together.

Create a section:

PLAY FROM JAVA OR BEDROCK

Java players

IP:
"veyl.playsmp.lol"

Port:
"34342"

Bedrock players

IP:
"veyl.playsmp.lol"

Port:
"34342"

IMPORTANT:

Do not assume the Bedrock connection details are different.

Use the same values above unless the admin changes them.

Make the Java and Bedrock settings editable from the admin dashboard.

---

SERVER FEATURES

Create a beautiful section called:

WHY VEYLSMP?

Use four premium feature cards.

ECONOMY

Build your wealth, trade with players, and create your own empire.

SURVIVAL

Explore, build, gather resources, and survive in a persistent world.

LIFESTEAL

Fight other players and experience the Lifesteal gameplay system.

CROSSPLAY

Play together with both Java and Bedrock players.

Each card should have:

- Icon
- Title
- Description
- Hover animation
- Blue/cyan glow

These features must be editable from the admin panel.

---

SERVER INFO

Create a dedicated Server Info section.

Display:

Server Name
VeylSMP

Gameplay
Economy Survival

Combat
Lifesteal

Platform
Java + Bedrock Crossplay

IP
veyl.playsmp.lol

Port
34342

Make every value editable through the admin dashboard.

---

RANKS / STORE

Create a premium-looking Ranks section.

Allow multiple rank categories.

Example:

PLAYER RANKS

- VIP
- MVP
- PRO
- ELITE
- LEGEND

These are only examples.

The admin must be able to create unlimited rank categories and ranks.

Each rank should support:

- Rank name
- Price
- Currency
- Description
- Features
- Duration
- Rank color
- Rank icon
- Purchase URL
- Category
- Display order
- Enabled/disabled

Example card:

VIP

₱XXX

- Feature 1
- Feature 2
- Feature 3

BUY NOW

Do not hardcode prices.

The admin must control everything.

---

DISCORD

Create a large Discord community section.

Title:

JOIN THE VEYLSMP COMMUNITY

Description:

Connect with other players, get server updates, participate in events, and become part of the VeylSMP community.

Button:

JOIN DISCORD

The Discord invite URL must be editable through the admin panel.

If a Discord server widget is configured, display:

- Server name
- Member count
- Online members

---

HOW TO JOIN

Create a simple step-by-step section.

JAVA EDITION

1. Open Minecraft Java Edition.
2. Select Multiplayer.
3. Click Add Server.
4. Enter:

"veyl.playsmp.lol"

5. Connect.

BEDROCK EDITION

1. Open Minecraft Bedrock Edition.
2. Go to Servers.
3. Select Add Server.
4. Enter:

Address:
"veyl.playsmp.lol"

Port:
"34342"

5. Connect.

Make these instructions editable from the admin panel.

---

RULES

Create a professional Rules page.

Default rules:

1. No cheating or unauthorized clients.
2. No exploiting server bugs.
3. Respect other players.
4. No harassment.
5. No inappropriate content.
6. Do not intentionally damage the server experience.
7. Follow staff instructions.

The admin must be able to:

- Add rules
- Edit rules
- Delete rules
- Reorder rules
- Enable/disable rules

---

NEWS / ANNOUNCEMENTS

Create a News section.

The admin can create:

- Announcements
- Updates
- Events
- Maintenance notices
- Giveaways

Each post should contain:

- Title
- Description
- Image
- Date
- Author
- Published/unpublished status

Newest posts appear first.

---

ADMIN DASHBOARD

Create a completely separate admin dashboard.

Route:

"/admin"

The dashboard must NOT be publicly accessible.

---

ADMIN AUTHENTICATION

There must be exactly ONE authorized administrator.

Authorized Google account:

"zensuyui@gmail.com"

Use Google OAuth.

There must be:

NO public admin registration.

Do NOT allow visitors to create accounts.

Do NOT allow users to choose their own admin email.

Only the Google account:

"zensuyui@gmail.com"

can access the admin dashboard.

If another Google account attempts to access "/admin", reject authentication and display:

Access Denied

The allowed email must be validated on the backend/server side.

Do NOT rely on frontend JavaScript to secure the admin panel.

Do NOT expose sensitive credentials or service-role keys in frontend code.

---

ADMIN DASHBOARD SIDEBAR

Create:

- Dashboard
- Homepage
- Server Settings
- Server Status
- Features
- Ranks
- Rank Categories
- Discord
- Rules
- News
- Navigation
- Appearance
- Media
- Security
- Activity Logs

---

ADMIN DASHBOARD — MAIN PAGE

Display:

VeylSMP Dashboard

Cards:

Server Status

🟢 Online

Players

24 / 100

Ranks

5

News Posts

12

Website

Online

Use real database/server data.

---

SERVER SETTINGS

Allow the admin to edit:

Java

IP:
"veyl.playsmp.lol"

Port:
"34342"

Bedrock

IP:
"veyl.playsmp.lol"

Port:
"34342"

Server Information

- Server name
- Server description
- Game modes
- Maximum players
- Server version
- MOTD

Features

- Economy
- Survival
- Lifesteal
- Crossplay

Allow the admin to enable/disable and edit these.

---

LIVE SERVER STATUS SETTINGS

Create an admin configuration page for the server status system.

Allow the admin to configure:

- Server hostname
- Port
- Java/Bedrock status checking
- Refresh interval
- Maximum player display
- Status display
- Maintenance mode

The live status system should never fabricate data.

If the status API returns an error, clearly display that the status could not be retrieved.

---

HOMEPAGE EDITOR

Allow the admin to edit the entire homepage.

Editable:

- Hero title
- Hero subtitle
- Description
- Hero background
- Hero image
- Buttons
- Button URLs
- Server IP
- Server port
- Feature cards
- Feature descriptions
- Section visibility
- Section order

---

RANK MANAGEMENT

Admin can:

Create Rank

Fields:

- Name
- Price
- Currency
- Description
- Features
- Color
- Icon
- Duration
- Purchase URL
- Category
- Display order
- Enabled

Edit Rank

Allow all fields to be changed.

Delete Rank

Show a confirmation dialog before deletion.

Rank Categories

Admin can:

- Create categories
- Rename categories
- Delete categories
- Reorder categories
- Enable/disable categories

---

WEBSITE APPEARANCE EDITOR

Allow the owner to customize:

- Primary color
- Secondary color
- Accent color
- Background
- Text color
- Logo
- Favicon
- Hero background
- Fonts
- Border radius
- Glow intensity

Default colors should be blue/light-blue/cyan.

Provide a live preview where practical.

---

MEDIA MANAGER

Allow admin to upload:

- Logo
- Favicon
- Rank icons
- Backgrounds
- News images
- Server images

Use secure cloud storage.

Recommended:

Supabase Storage

---

DATABASE

Use:

Supabase

for:

- Authentication
- PostgreSQL database
- Storage
- Row Level Security

Suggested tables:

"site_settings"

"server_settings"

"features"

"rank_categories"

"ranks"

"rank_features"

"rules"

"news"

"navigation"

"media"

"admin_users"

"activity_logs"

---

SECURITY

Implement:

- Google OAuth
- Single-admin authorization
- Backend authorization
- Supabase Row Level Security
- Protected admin routes
- No public admin registration
- Secure environment variables
- No service-role keys in frontend
- Database permission policies
- Admin activity logs

Every database mutation must be authorized server-side.

The public website should have read-only access to public content.

Only the authorized admin can modify website content.

---

ACTIVITY LOGS

Record important admin actions:

- Login
- Logout
- Create rank
- Edit rank
- Delete rank
- Change server settings
- Edit homepage
- Create news
- Delete news
- Change appearance
- Upload media

Display:

- Action
- Timestamp
- Admin
- Affected item

---

NAVIGATION

Main navigation:

Home

Server

Ranks

Rules

News

Discord

Add a prominent:

PLAY NOW

button.

The navigation should become a hamburger menu on mobile.

The admin should be able to edit the navigation.

---

DESIGN

Use a premium visual system.

Background:

Dark navy/black-blue.

Primary:

Blue.

Accent:

Light blue/cyan.

Use subtle gradients such as:

Blue → Cyan

Cards should have:

- Rounded corners
- Glass effect
- Subtle borders
- Blue glow
- Smooth hover animations

Use modern fonts.

Do NOT use excessive neon effects.

The website should look professional and clean.

---

ANIMATIONS

Use Framer Motion.

Include:

- Fade-in animations
- Slide-up animations
- Smooth section transitions
- Hover effects
- Button animations
- Mobile menu animations
- Server status pulse
- Card hover glow

Keep animations optimized.

Avoid anything that causes mobile performance issues.

---

MOBILE

The website MUST be optimized for Android phones.

Everything must work properly on:

- Small phones
- Large phones
- Tablets
- Desktop
- Large monitors

The admin dashboard must also be mobile responsive.

Make buttons large enough for touch controls.

---

PERFORMANCE

Optimize for:

- Fast loading
- Mobile performance
- Lazy-loaded images
- Optimized media
- Efficient API requests
- API caching
- Minimal unnecessary JavaScript
- Responsive images

Do not poll the Minecraft status API excessively. Respect the API's caching and rate limits.

---

SEO

Website title:

VeylSMP | Minecraft Economy Survival Server

Description:

Join VeylSMP — a Minecraft Economy Survival server featuring Lifesteal and Java + Bedrock crossplay.

Add:

- Open Graph metadata
- Favicon
- Proper heading hierarchy
- SEO-friendly URLs
- Social sharing metadata

---

IMPORTANT

This should be a real working website, not just a visual mockup.

Implement:

1. Functional Google authentication.
2. Secure single-admin authorization.
3. Functional Supabase database.
4. Functional admin CRUD operations.
5. Functional image uploads.
6. Functional Minecraft server status.
7. Functional live player count.
8. Functional copy-IP button.
9. Functional Discord button.
10. Responsive mobile design.
11. Persistent website settings.
12. Persistent rank settings.
13. Persistent news/rules.
14. Secure database policies.

Do not use fake data for the live server status.

Default server configuration:

VeylSMP

IP: "veyl.playsmp.lol"

Port: "34342"

Features:

- Economy
- Survival
- Lifesteal
- Crossplay

The final result should feel like a premium Minecraft server network website, with a polished blue/cyan identity and a powerful but easy-to-use owner dashboard.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b3a00413-3853-4a4f-b980-e21a416ff9c3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
