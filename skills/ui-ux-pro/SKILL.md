---
name: designing-ui-ux
description: Генерирует комплексные дизайн-системы и интерфейсы премиум-класса, используя движок рассуждений UI-UX Pro.
---

# UI-UX Pro Gemini Engine

Этот навык превращает Gemini в мощный инструмент проектирования интерфейсов, ориентированный на визуальную эстетику («WOW-эффект») и техническое совершенство.

## 1. Intelligent Design System Generation (Reasoning Engine)

При получении запроса на UI/UX, Gemini ОБЯЗАН выполнить следующие шаги рассуждения:

1.  **Requirement Analysis**: Анализ индустрии, целевой аудитории и ключевых слов (напр., "Beauty Spa" -> "Calming", "Luxury").
2.  **Pattern Selection**: Выбор структуры (напр., Hero-Centric + Social Proof).
3.  **Style Definition**: Определение визуального стиля (Glassmorphism, Soft UI, Minimalism и т.д.).
4.  **Color & Typography Selection**: Подбор палитры и шрифтовых пар из набора UI-UX Pro (96 палитр / 57 пар).
5.  **Anti-Pattern Filtering**: Исключение отраслевых ошибок (напр., неоновые цвета для банков).

## 2. Master + Overrides Pattern

Для поддержания консистентности используй структуру `design-system/`:
- **MASTER.md**: Глобальный источник истины (цвета, шрифты, отступы, базовые компоненты).
- **pages/[page-name].md**: Локальные переопределения для конкретных страниц.

При разработке страницы:
1. Прочитай `design-system/MASTER.md`.
2. Проверь наличие переопределений в папке `pages/`.
3. Генерируй код на основе иерархии правил.

## 3. Pre-delivery Checklist (СТРОГО)
- [ ] **Accessibility**: Контраст текста минимум 4.5:1 (WCAG AA).
- [ ] **Animations**: Плавные переходы (150-300ms) для всех hover-состояний.
- [ ] **Cursors**: `cursor-pointer` для всех интерактивных элементов.
- [ ] **No Emojis**: Использование только SVG (Lucide/Heroicons).
- [ ] **Responsiveness**: Адаптив под 375px, 768px, 1024px, 1440px.

## 4. Technology Stacks
- **Vanilla CSS**: Приоритет №1 для кастомных премиум-дизайнов.
- **HTML + Tailwind**: По запросу пользователя.
- **Modern Frameworks**: Next.js, React, Vite (при необходимости).

## 5. Visual Aesthetics Guidelines
- Избегай стандартных цветов (чистый красный/синий). Используй сложные градиенты и HSL.
- Добавляй микро-взаимодействия (subtle hover lifts, smooth fades).
- Используй типографику Google Fonts (Inter, Montserrat, Cormorant Garamond).
