---
name: generating-skills
description: Генерирует уникальные директории скиллов в папке /skills/. Используется для создания новых инструментов автоматизации.
---

# Skill Creator System

## 1. Core Structural Requirements
Каждый создаваемый скилл ОБЯЗАН иметь свою уникальную подпапку:
- `skills/[unique-skill-name]/SKILL.md` (Логика и YAML)
- `skills/[unique-skill-name]/scripts/` (Опционально: скрипты)
- `skills/[unique-skill-name]/examples/` (Опционально: примеры)

## 2. YAML Frontmatter Standards (СТРОГО)
- **name**: Должен быть УНИКАЛЬНЫМ и отражать суть нового скилла.
- **Формат name**: Только gerund (отглагольное), строчные буквы, через дефис. 
- **ЗАПРЕТ**: Никогда не копируй `name: generating-skills` в новые файлы.
- **description**: Писать строго в третьем лице (напр. "Управляет контейнерами Docker...").

## 3. Writing Principles (The "Claude Way")
- **Conciseness**: Фокус на уникальной логике, без лишних пояснений.
- **Workflow**: Использование чек-листов [ ] для отслеживания прогресса.
- **Safety**: Сначала проверка (валидация), потом выполнение.

## 4. Алгоритм создания (Workflow)
1. **Identify**: Определить уникальное имя на основе задачи пользователя.
2. **Draft**: Создать YAML с новым уникальным `name`.
3. **Write**: Наполнить `SKILL.md` конкретными инструкциями.
4. **Deploy**: Создать физическую структуру папок в `/skills/`.

## 5. Output Format
Всегда выводи результат в этом формате:

### [Folder Name]
**Path:** `skills/[unique-name-of-new-skill]/`

### [SKILL.md]
```markdown
---
name: [ВСТАВИТЬ_НОВОЕ_УНИКАЛЬНОЕ_ИМЯ]
description: [ОПИСАНИЕ_В_ТРЕТЬЕМ_ЛИЦЕ]
---
# [Заголовок скилла]
...