---
title: "Caterpillar: Industrial HMI Design System"
slug: caterpillar-hmi
order: 1
featured: true
company: Caterpillar Inc.
role: PM + UX
domain: Industrial HMI · Embedded
accent: "#F5C518"
tags: Industrial HMI,Embedded Systems,UX Lead + PM
summary: Designed the intelligence layer for Caterpillar's power generation
  control hardware, end-to-end UX lead and PM, resulting in a granted U.S.
  design patent.
---
## The Problem

Caterpillar's power generation systems, generator sets and LSLD (Load Shed / Load Demand) controllers, operate in environments where a misread value or delayed response can cause equipment failure or safety incidents. Operators navigated dense, inconsistent interfaces across hardware generations with no unified design system.

I was brought on as UX Design Lead with PM responsibilities to create a cohesive HMI for a new class of Caterpillar generator control hardware, building both the visual design system and the product development process from scratch.

> "The challenge wasn't just visual, it was translating complex real-time system states (power load, frequency, sequencing logic) into an interface a field technician could trust under pressure."

## Impact


| Metric | Result |
| ------------------------------------ | ------ |
| Cross-functional collaborators | ~8 |
| Core delivery artifacts | 4 |
| Estimated reduction in review cycles | ~30% |


## Process

### 01 — Operator Research & Context Mapping

Studied generator operator workflows across single-gen and grid-parallel environments. Mapped mental models for diagnosing system state — load, frequency, voltage, LSLD sequencing, and identified where existing interfaces caused hesitation or errors.

### 02 — Navigation Architecture

Designed a hierarchical navigation tree covering the full screen taxonomy, Genset Overview, LSLD Control, Sync, DBA, and Load Share views, documented in Word for engineering readability.

### 03 — High-Fidelity Mockups (Adobe Xd)

Produced pixel-accurate, full-color mockups representing every screen state, active/idle modes, real-time data readouts, alert states, feedback sections, in a dark-themed visual system optimized for low-light industrial environments.

### 04 — Annotation Specs & Modbus Mapping

Annotated every UI element's behavior, data binding, and state logic. Created a companion Modbus Table linking each display parameter to its register address — eliminating back-and-forth between design and firmware.

### 05 — Agile Sprint Execution

Ran sprint cycles with cross-functional reviews involving firmware engineers, product managers, and field operations.

## Deliverables

- **Navigation Tree** — Full screen taxonomy in Word
- **Hi-Fi Mockups · Figma** — Pixel-accurate dark-themed UI covering all screen states
- **Annotated Specs** — Behavior documentation per UI element
- **Modbus Table** — Parameter-to-register mapping bridging UX and firmware

