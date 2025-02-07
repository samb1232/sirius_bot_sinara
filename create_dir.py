import os

BASE_DIR = "bot_structure"

structure = {
    "Папка1": {
        "Подпапка1": {"info.txt": "Текст из файла info.txt"},
        "Подпапка2": {"data.txt": "Другой текст из файла"},
    },
    "Папка2": {
        "readme.txt": "Это readme файл в Папке2",
    },
}

def create_structure(base, struct):
    for name, content in struct.items():
        path = os.path.join(base, name)
        if isinstance(content, dict):
            os.makedirs(path, exist_ok=True)
            create_structure(path, content)
        else:
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)

if __name__ == "__main__":
    os.makedirs(BASE_DIR, exist_ok=True)
    create_structure(BASE_DIR, structure)
    print(f"Тестовая директория '{BASE_DIR}' создана!")