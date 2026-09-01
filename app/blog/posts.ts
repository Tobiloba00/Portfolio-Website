export type BlogPost = {
    slug: string;
    title: string;
    category: string;
    year: string;
    readTime: string;
    excerpt: string;
    content: string;
};

export const posts: BlogPost[] = [
    {
        slug: 'automation-breaks-in-production',
        title: 'Why Your Automation Workflow Breaks When a Real Person Uses It',
        category: 'Lessons Learned',
        year: '2026',
        readTime: '6 min read',
        excerpt: 'The gap between "it works in testing" and "it works in production" is almost always a people problem, not a technical one. Here\'s what I keep finding.',
        content: `There's a specific kind of embarrassment that only automation engineers know.

You've spent three days building a workflow. You've tested every node. The data flows perfectly. The AI agent responds exactly how you told it to. You hit the test button one final time, everything passes, and you lean back feeling like you actually know what you're doing.

Then a real person uses it. And it breaks.

Not because your code was wrong. Not because you missed a node. It breaks because the person typed "ASAP" instead of selecting a date. Or they sent two messages back to back before the workflow finished processing the first one. Or they copied a tracking number with a space at the end and your Shopify lookup returned nothing.

You built for the clean version of the problem. They arrived with the messy version of their life.

---

## The Gap Nobody Warns You About

When you're building automation, you're working in a controlled environment. You know what the inputs look like because you designed them. You know the data will come in a certain format because you set up the form. You know the trigger will fire at the right time because you scheduled it.

Real users don't know any of that. They just know they have a problem and your system is supposed to solve it.

I learned this properly when I was building the customer support automation for BIUK, a brand that sells ProFoam. The workflow was straightforward: customer sends a WhatsApp message, an automation picks it up via Chatwoot, checks if it's an order query, looks up the order on Shopify, replies with tracking info.

It worked perfectly in testing. Every single run.

Then we went live and within the first day I had three failures. Customer one typed "where's my stuff" — my keyword matching didn't catch it. Customer two sent their order number with a hashtag in front of it — my regex wasn't accounting for that. Customer three sent a voice note — the workflow had no idea what to do with audio and just went silent.

The workflow was technically correct. It just wasn't built for humans.

---

## What "Built for Humans" Actually Means

I've thought about this a lot since that day. And I think the problem comes down to one thing: when we build automation, we think about the happy path. The user does exactly what we expect, the data is exactly how we need it, everything connects cleanly.

But users don't walk the happy path. They walk their path. And their path goes through typos and voice messages and copy-pasted text with weird formatting and the occasional all-caps message because they're frustrated.

Building for humans means building for all of that.

For the BIUK workflow I ended up making three changes. First, I expanded the keyword matching to catch variations — not just "track my order" but "where is," "my order," "delivery," "dispatched," "shipped," and about fifteen other ways people ask the same question. Second, I added a normalization step at the start that strips special characters, trims whitespace, and lowercases everything before any logic runs. Third, I added a fallback branch — if the workflow can't match the intent, it sends a human-sounding reply that buys time for a real agent to step in.

None of those changes were technically impressive. But they're the difference between a workflow that works in demo and one that works in production.

---

## The Three Things That Break Every Workflow

After building across enough projects — property management, lead generation, customer support, document processing — I've noticed the same three culprits appear every time.

**Unexpected input format.** Your workflow expects a number, someone sends text. Your workflow expects a date, someone sends "tomorrow." Your workflow expects a clean email, someone sends one with trailing spaces. Solve this with normalization and validation at the entry point, not halfway through.

**Timing and race conditions.** Two messages come in two seconds apart. The first message triggers the workflow, which takes four seconds to run. The second message triggers it again before the first finishes. Now you have two instances running simultaneously, both trying to update the same record, and one of them writes over the work of the other. This happened to me in the Telegram-to-Notion pipeline and it was a nightmare to debug. Solve it with proper queuing or idempotency checks.

**Silent failures.** The workflow hits an error, catches it gracefully, and does nothing. No alert, no fallback, no notification to anyone. From the outside it looks like everything is fine. From the inside, records aren't being created, messages aren't being sent, and nobody knows. Solve this by building logging and alerting into every workflow from day one, not as an afterthought.

---

## The Real Standard

I've started using a simple test for every workflow before I call it done. I ask myself: what would happen if someone who has never seen this workflow uses it on a bad day — rushing, stressed, not reading instructions?

If the answer is "it breaks," it's not ready.

The automation is supposed to remove friction for the human, not require the human to be perfect so the automation can function. That's backwards. The system should absorb the messiness of real life, not reject it.

The best workflows I've built are the ones users never think about. They just send a message, or submit a form, or trigger an action — and the right thing happens. No errors. No confusion. No support ticket about why it didn't work.

That's the actual goal. Not a workflow that works in testing. One that works when a real person is having a real day.

---

*Olujimi builds automation systems and full-stack products from Nigeria. If your team is copy-pasting between tabs, there's probably a better way.*`,
    },
    {
        slug: 'building-for-international-clients-from-nigeria',
        title: 'What Building for International Clients From Nigeria Actually Looks Like',
        category: 'My Journey',
        year: '2026',
        readTime: '7 min read',
        excerpt: 'Time zones, tools, trust, invoicing, and why the work itself eventually becomes the argument for hiring you.',
        content: `The first time I got on a call with an international client, it was 10pm my time and 9pm theirs.

I had made sure my background was clean. I had tested my microphone three times. I had the project brief open in another tab in case I forgot something. I was nervous in the specific way you get nervous when you know the stakes are real — not test stakes, actual stakes.

The call went fine. The project went well. They came back with another one.

But what nobody tells you about working internationally from Nigeria — especially when you're early in your career, especially when you're still figuring out how to price yourself, especially when the gap between your local context and their context is wider than just time zones — is how much invisible work sits underneath every successful project.

This is that story.

---

## How It Started

I didn't set out to work with international clients specifically. I set out to find clients who would pay fairly for real work. That search led me away from local markets faster than I expected.

Not because Nigerian businesses don't need automation or development work. They do. But the budget conversations were different. The expectations were different. The willingness to invest in infrastructure versus just getting something live and cheap — that was different.

So I went where the work was. Fiverr, Upwork, cold outreach, referrals. Over time the pattern that emerged was: the clients who moved projects forward properly, communicated clearly, and paid on time were overwhelmingly international, based mostly in Europe and North America.

The first serious international engagement came through a referral. A real estate company that needed their maintenance operations automated. Maintenance requests coming in through different channels, contractors being assigned manually, landlord reports being written by hand. The whole thing was a person doing work that a system should have been doing.

I built it with an AI automation workflow. Three weeks, fully operational. Maintenance request comes in, triage logic runs, the right contractor gets messaged, the appointment gets scheduled, the landlord gets a report. Nobody has to touch it.

That project opened the door for everything after.

---

## The Time Zone Reality

People romanticize working across time zones. "You can work from anywhere." Yes. But also: a client several hours ahead needs a response before they leave the office, which might be 4pm their time and 5pm mine. If something breaks on a Friday afternoon their time, that's Friday evening mine. If they want a standup call in the morning, "morning" for them is often still very early for me.

You adapt. You build your schedule around it. You start communicating more through async messages so real-time availability matters less. You over-document everything so a client can check the status of something without waiting for you to be online.

The adaptation is real but it's manageable. What's less manageable — at first — is the context gap.

---

## The Context Gap Nobody Talks About

When an international client says "this is urgent," they mean something specific by that. When they say "can we hop on a call," that's not a casual suggestion. When they send a message that seems short and blunt, it's usually just efficiency, not rudeness.

These things sound obvious but they're not obvious until you've gotten them wrong once or twice and had to recalibrate.

I've had moments where I read a client message as more relaxed than it was, and my response timing reflected that, and I could feel the shift in their tone in the next message. I've had moments where I over-explained things in a way that read as lacking confidence rather than being thorough.

You learn the register. You learn what "let me know your thoughts" really means and what "as discussed" in an email really means. You start to understand that professional communication in that context is its own skill, separate from the technical work.

The technical work I was already good at. The communication calibration took longer.

---

## What Actually Builds Trust

I used to think trust was built by being available — responding fast, always online, never missing a message. And responsiveness matters. But I've learned that's not where trust actually lives.

Trust gets built when you spot a problem before your client does. When you flag something that isn't in your scope but would affect their outcome. When you send an update they didn't ask for because you know they're thinking about it.

With BIUK — a client I worked with — there was a point early in the engagement where I noticed the Chatwoot webhook was sometimes dropping messages during high traffic. I hadn't been asked to monitor that. It wasn't causing visible failures yet. But I flagged it, explained what I was seeing, and proposed a fix before it became a problem they had to come to me about.

That one moment did more for the working relationship than weeks of just completing assigned tasks.

---

## The Money Conversation

Pricing internationally when you're based in Nigeria is genuinely uncomfortable at first.

There's a voice in your head that says: charge less than they would pay someone local, that's your competitive advantage. And in the early days, that voice is partially right — you might need to price yourself into early opportunities.

But the trap is staying there. Underpricing signals something to clients, even when they don't say it explicitly. It changes how they perceive the work. It changes how much they invest in the engagement.

I've raised my rates twice since I started doing this work. Both times I lost a few conversations. Both times the clients I retained or gained after the increase were better engagements than the ones before it.

The work you do from Nigeria is not worth less than the same work done anywhere else in the world. The infrastructure you build either works or it doesn't. The automation you design either handles the volume or it doesn't. Geography is not a relevant variable in that evaluation.

It took me a while to actually believe that, not just say it.

---

## What That Work Looked Like

I've worked with international clients — one in real estate, one in e-commerce. Between them I built AI automation workflows that processed customer support requests, tracked orders via Shopify, handled WhatsApp integrations, and synced data across Chatwoot, Notion, and Monday.com.

It was real infrastructure. Real people at those companies used it every day without thinking about it. That's the goal every time — build it so well that it disappears into the background of how people work.

I'm still in Nigeria. The clients were on the other side of the world. The time zone gap was still there.

But the work spoke loudly enough that it didn't really matter.

---

*Olujimi builds automation systems and full-stack products from Nigeria, working with clients internationally. Currently open to new projects.*`,
    },
    {
        slug: 'lenticular-art-marketplace-build-log',
        title: 'How I Built a Lenticular Art Marketplace From Scratch (And What Nearly Broke Me)',
        category: 'Behind the Scenes',
        year: '2026',
        readTime: '8 min read',
        excerpt: 'Sprite sheets, Notion sync, a 95% bandwidth win, and the bugs that nearly broke me. A full build log of a marketplace for art that actually moves.',
        content: `A lenticular art company needed a full marketplace platform. Artists would submit their work, an admin would review and publish it, and buyers would browse a shop where the artwork actually moved — the way lenticular art is supposed to work.

Simple enough brief. Except nothing about lenticular art is simple to render on the web.

This is the story of that project — what I built, what broke, what I fixed, and what I learned.

---

## What Lenticular Art Actually Is

If you've never heard the term, lenticular art is the kind of image that changes or animates when you tilt it. Think of those old holographic stickers or the birthday cards that shift between two images as you move them. The physical version uses a ridged plastic lens over a printed image to create the illusion of movement.

Translating that to a browser is a different problem entirely. You're not dealing with a physical lens. You're dealing with sequences of images — sometimes 20 frames, sometimes 30, sometimes 42 or 63 — and you need to display the right frame based on how the user is interacting with the screen. Mouse movement, trackpad, gyroscope on mobile, drag on touch.

The client wanted buyers to see the artwork move when they browsed the shop. Not a GIF, not a video — a proper interactive experience that responded to the viewer in real time.

That's the challenge I walked into.

---

## The Architecture

The platform had three distinct parts that all needed to talk to each other cleanly.

**The artist submission flow.** Artists fill out an application, upload their frame sequences (sometimes as individual images, sometimes as video), and submit for review. The system processes everything and stores it in Supabase.

**The admin dashboard.** The client reviews incoming submissions, can edit details and replace images, and publishes approved work to the shop with one click. Status flows from pending to published to archived.

**The public shop and product pages.** Where buyers browse. This is where the lenticular viewer lives — the part that needs to feel like the actual artwork, not a screenshot of it.

The backend is Supabase with two main tables: artist_applications for the submission data and application_files for the frame sequences. Every status change on the platform triggers a Supabase Edge Function that syncs everything to Notion — the client managed their review workflow there and needed both databases fully in sync without any manual data entry.

---

## The Bandwidth Problem

The first version of the platform loaded each frame as a separate image file.

For a 20-frame sequence that's 20 network requests every time someone views a product. At 30 frames it's 30 requests. At 42 frames — which some of the sequences were — it's 42 requests just to display one piece of artwork.

In testing this was fine. In production with multiple products on a shop page, it was a disaster. Load times were bad. Supabase bandwidth was getting hammered. The client's costs were going to scale catastrophically as the catalogue grew.

I needed to rethink how the frames were stored and delivered.

The solution was sprite sheets. Instead of 40 individual image files, the system compresses all frames into a single image arranged in a grid — say 8 columns by 5 rows for a 40-frame sequence. One network request instead of 40. The lenticular viewer then calculates which section of the grid corresponds to the current frame and renders just that portion.

The bandwidth reduction was around 95%. One request versus forty. The client's infrastructure costs dropped immediately and the viewer actually became smoother because it wasn't waiting on sequential image loads.

---

## The Grid Problem

The sprite sheet approach created a new problem: the grid layout had to be dynamic.

If every sequence was exactly 40 frames you could hardcode an 8x5 grid and move on. But sequences came in at different lengths — 30 frames, 42 frames, 63 frames. The viewer needed to figure out the correct grid layout automatically based on how many frames were in the sequence.

And there was an edge case that took me longer than I'd like to admit to handle correctly. What if the number of frames doesn't divide evenly into a neat grid? A 37-frame sequence in a 7x6 grid leaves 5 empty squares at the end. If the viewer doesn't know to stop at frame 37, it renders those empty black squares as part of the animation loop. The artwork glitches at the end of every cycle.

The fix was tracking the exact frame count at generation time and passing that into the viewer so it knew precisely where to stop regardless of what the grid looked like. Simple in retrospect. Not obvious until you've watched a client's artwork glitch in a loop and had to figure out why.

---

## The Sprite Sheet Thumbnail Problem

Once sprite sheets were in production, a new bug surfaced in the shop view.

The main product thumbnail — the image buyers see on the shop grid before they click into a product — was pulling from the first file associated with each submission. Which, after the sprite sheet migration, was now the sprite sheet itself. An 8x5 grid of tiny frames instead of a clean hero image of the artwork.

It looked terrible. Every product in the shop was showing what looked like a broken mosaic.

The fix was adding a separate thumbnail field that always pulled from the original file_path of the first submitted frame rather than the processed sprite URL. Small change, big visual difference. The shop immediately looked like a professional gallery again.

---

## The Notion Sync

The client ran their review workflow in Notion. They had two databases set up and ready: Artists & Designs and Designs & Frames. They wanted every submission that came through the platform to appear in Notion automatically — all fields, not just the basics.

The first version of the sync was only carrying over a subset of fields. Design name, artist name, status. But the client needed everything — country code, date of birth, mobile, payment method, payment details, agreement to terms, privacy policy acceptance.

The issue was that the Edge Function was mapping fields manually and I'd only mapped the obvious ones. The fix was a full field audit across both the Supabase schema and the Notion database structure, then rebuilding the sync to map every column correctly. After that, every time a submission was published, the full record — with all fields — landed in Notion automatically without anyone touching it.

The client's exact words when I told him it was done: "That's exactly what I needed."

---

## What the Viewer Actually Does

The lenticular viewer is the part of this project I'm most proud of.

It takes a sprite sheet URL and a frame count, renders the artwork to a canvas element, and responds to four different input types: mouse movement across the image, trackpad scroll, touch drag on mobile, and gyroscope tilt on devices that support it. Each input maps to a frame position within the sequence.

The effect when you move your mouse across a product image on the shop — watching the artwork shift and animate the way lenticular art physically does — is genuinely impressive. The client sent me a message the first time he tested it live that I still have saved.

Getting there required handling a lot of edge cases: what happens when the canvas resizes, how to prevent frame flickering during rapid input, how to make the gyroscope feel natural rather than jittery, how to make the auto-rotate loop smooth when no user input is present.

None of it is rocket science individually. Together it took a lot of iteration to feel right.

---

## What I Took From It

This project taught me three things I've carried into every build since.

**Performance problems are architecture problems.** The 40-requests-per-product issue wasn't a bug to patch, it was a structural decision that needed to be unmade. Fixing it required rethinking how data was stored, not just how it was fetched. Most real performance problems look like this.

**Edge cases live at the intersection of your assumptions.** I assumed frame counts would be clean numbers. They weren't. I assumed the first file in a submission would be a clean frame. After sprite sheet generation, it wasn't. Every assumption you don't test explicitly is a bug waiting to be discovered by a user.

**Clients communicate in goals, not specifications.** When the client said he wanted the viewer to "feel like the real thing," he wasn't telling me what to build. He was telling me what outcome to aim for. The implementation decisions — sprite sheets, canvas rendering, multi-input support — were mine. That's what doing the job properly actually means.

---

*The platform is live and actively adding new artists. If you're working on a project that involves complex media rendering, interactive product experiences, or marketplace infrastructure, I'd be glad to talk.*`,
    },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
    return posts.find(p => p.slug === slug);
}
