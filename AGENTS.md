<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Use TanStack file routes with leaf metadata and shared site chrome in the root; each named section is independently navigable and shareable.
- Keep catalogue, learning resources, and editorial articles in a typed content module; opportunity samples are explicitly previews and cannot register.
- Use validated public server intake and durable atomic rate limits for contact submissions; privileged insertion is isolated inside the handler and no public reading is allowed.
- Preserve the official logo through its imported asset pointer; the favicon is a proportionally resized copy of the entire artwork.
