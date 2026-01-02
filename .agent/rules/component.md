---
trigger: always_on
---

- when create a component see if there are a wrapper component exist in the packages/ui
- if yes try to use that component wrapper 
- if no create a new component wrapper inside packages/ui and use it in your job
- if there are the existing component wrapper but you need to edit it to complete your work please do so
- every component need to be create on top of shadcn component in packages/ui/src/lib/components/ui