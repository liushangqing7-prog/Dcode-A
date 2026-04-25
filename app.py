#!/usr/bin/env python3
"""Dcode-A Python 纯命令行版本。

不依赖网页，不启动 HTTP 服务。
提供小说项目的初始化、章节管理和统计功能。
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
from pathlib import Path
from typing import Any

APP_DIRNAME = ".dcodea"
PROJECT_FILE = "project.json"
CHAPTERS_DIR = "chapters"


class CLIError(Exception):
    """可预期的命令行错误。"""


def now_iso() -> str:
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat()


def app_dir(root: Path) -> Path:
    return root / APP_DIRNAME


def project_path(root: Path) -> Path:
    return app_dir(root) / PROJECT_FILE


def chapters_dir(root: Path) -> Path:
    return app_dir(root) / CHAPTERS_DIR


def ensure_project_exists(root: Path) -> None:
    if not project_path(root).exists():
        raise CLIError(
            "未检测到项目，请先执行：python app.py init --title '你的小说名'"
        )


def read_project(root: Path) -> dict[str, Any]:
    ensure_project_exists(root)
    with project_path(root).open("r", encoding="utf-8") as f:
        return json.load(f)


def write_project(root: Path, data: dict[str, Any]) -> None:
    p = project_path(root)
    p.parent.mkdir(parents=True, exist_ok=True)
    with p.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


def cmd_init(args: argparse.Namespace) -> None:
    root = Path(args.root).resolve()
    proj = project_path(root)
    if proj.exists() and not args.force:
        raise CLIError("项目已存在。若要覆盖，请追加 --force")

    metadata = {
        "title": args.title,
        "author": args.author,
        "created_at": now_iso(),
        "updated_at": now_iso(),
        "description": args.description,
        "tags": args.tags,
    }
    write_project(root, metadata)
    chapters_dir(root).mkdir(parents=True, exist_ok=True)
    print(f"已初始化项目：{metadata['title']}")
    print(f"目录：{app_dir(root)}")


def chapter_file(root: Path, index: int) -> Path:
    return chapters_dir(root) / f"{index:04d}.md"


def list_chapter_files(root: Path) -> list[Path]:
    cdir = chapters_dir(root)
    if not cdir.exists():
        return []
    return sorted(cdir.glob("*.md"))


def cmd_add(args: argparse.Namespace) -> None:
    root = Path(args.root).resolve()
    ensure_project_exists(root)

    files = list_chapter_files(root)
    next_index = len(files) + 1
    path = chapter_file(root, next_index)
    content = f"# 第{next_index}章：{args.title}\n\n{args.content}\n"
    path.write_text(content, encoding="utf-8")

    proj = read_project(root)
    proj["updated_at"] = now_iso()
    write_project(root, proj)

    print(f"已新增章节：{path.name}")


def cmd_list(args: argparse.Namespace) -> None:
    root = Path(args.root).resolve()
    ensure_project_exists(root)

    files = list_chapter_files(root)
    if not files:
        print("暂无章节。")
        return

    for f in files:
        first_line = f.read_text(encoding="utf-8").splitlines()[0] if f.stat().st_size else "(空文件)"
        print(f"{f.stem}: {first_line}")


def cmd_show(args: argparse.Namespace) -> None:
    root = Path(args.root).resolve()
    ensure_project_exists(root)

    path = chapter_file(root, args.index)
    if not path.exists():
        raise CLIError(f"章节不存在：{args.index}")
    print(path.read_text(encoding="utf-8"))


def cmd_stats(args: argparse.Namespace) -> None:
    root = Path(args.root).resolve()
    proj = read_project(root)

    files = list_chapter_files(root)
    total_chars = 0
    for f in files:
        total_chars += len(f.read_text(encoding="utf-8"))

    print("=== 项目统计 ===")
    print(f"标题: {proj.get('title', '')}")
    print(f"作者: {proj.get('author', '')}")
    print(f"章节数: {len(files)}")
    print(f"总字数(含标点与空白): {total_chars}")
    print(f"上次更新: {proj.get('updated_at', '')}")


def cmd_export(args: argparse.Namespace) -> None:
    root = Path(args.root).resolve()
    proj = read_project(root)
    files = list_chapter_files(root)
    if not files:
        raise CLIError("没有可导出的章节。")

    out = Path(args.output).resolve()
    lines = [f"# {proj.get('title', '未命名作品')}", ""]
    if proj.get("author"):
        lines.extend([f"作者：{proj['author']}", ""])

    for f in files:
        lines.append(f.read_text(encoding="utf-8").rstrip())
        lines.append("")

    out.write_text("\n".join(lines).strip() + "\n", encoding="utf-8")
    print(f"导出完成：{out}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Dcode-A 纯 Python 命令行工具")
    parser.add_argument("--root", default=".", help="项目根目录（默认当前目录）")

    sub = parser.add_subparsers(dest="command", required=True)

    p_init = sub.add_parser("init", help="初始化小说项目")
    p_init.add_argument("--title", required=True, help="作品标题")
    p_init.add_argument("--author", default="", help="作者")
    p_init.add_argument("--description", default="", help="简介")
    p_init.add_argument("--tags", nargs="*", default=[], help="标签")
    p_init.add_argument("--force", action="store_true", help="覆盖已有项目")
    p_init.set_defaults(func=cmd_init)

    p_add = sub.add_parser("add", help="新增章节")
    p_add.add_argument("--title", required=True, help="章节标题")
    p_add.add_argument("--content", default="", help="章节正文")
    p_add.set_defaults(func=cmd_add)

    p_list = sub.add_parser("list", help="列出章节")
    p_list.set_defaults(func=cmd_list)

    p_show = sub.add_parser("show", help="查看某一章")
    p_show.add_argument("index", type=int, help="章节编号，例如 1")
    p_show.set_defaults(func=cmd_show)

    p_stats = sub.add_parser("stats", help="查看项目统计")
    p_stats.set_defaults(func=cmd_stats)

    p_export = sub.add_parser("export", help="导出为单个 Markdown 文件")
    p_export.add_argument("--output", default="novel.md", help="导出文件路径")
    p_export.set_defaults(func=cmd_export)

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    try:
        args.func(args)
        return 0
    except CLIError as exc:
        print(f"错误: {exc}")
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
