# -*- coding: utf-8 -*-
"""
=============================================================================
           ETEBOX VIP FOR VIDEOS - TELEGRAM BOT & WEB APP SCRIPT
                      Format: Standard Python (.py)
           Compatible with: pyTelegramBotAPI / Telebot & Telebot Creator
=============================================================================
"""

import telebot
from telebot import types

# ==========================================
# 1. CONFIGURATION / الإعدادات
# ==========================================
BOT_TOKEN = "YOUR_BOT_TOKEN_HERE"
WEBAPP_URL = "https://ais-pre-p6vszzi4pdk6vklchcjxtj-907463358942.europe-west2.run.app"

FREE_VIDEOS_URL = "https://rentry.co/Teteboxvip"
VIP_STORE_URL = "https://rentry.co/VIP2026"
STORAGE_URL = "https://rentry.co/Cloud_ETEBOX"
NEWEST_LINK_URL = "https://rentry.co/WELCOME_2026"
SUPPORT_URL = "https://t.me/EteboxSupport"

bot = telebot.TeleBot(BOT_TOKEN, parse_mode="HTML")


# ==========================================
# 2. KEYBOARD BUILDERS / بناء لوحات الأزرار
# ==========================================
def get_main_inline_keyboard():
    markup = types.InlineKeyboardMarkup(row_width=1)

    webapp_info = types.WebAppInfo(url=WEBAPP_URL)
    webapp_btn = types.InlineKeyboardButton(
        text="🎬 فتح تطبيق ETEBOX VIP (Web App)",
        web_app=webapp_info
    )

    btn_new = types.InlineKeyboardButton(
        text="✨ WELCOME 2026 (الرابط الحصري)",
        url=NEWEST_LINK_URL
    )
    btn_vip = types.InlineKeyboardButton(
        text="💎 VIP STORE VIDEOS (متجر VIP)",
        url=VIP_STORE_URL
    )
    btn_free = types.InlineKeyboardButton(
        text="🎬 FREE CHANNEL (القناة المجانية)",
        url=FREE_VIDEOS_URL
    )
    btn_storage = types.InlineKeyboardButton(
        text="☁️ CLOUD STORAGE (التخزين السحابي)",
        url=STORAGE_URL
    )
    btn_support = types.InlineKeyboardButton(
        text="💬 الدعم الفني والمساعدة",
        url=SUPPORT_URL
    )

    markup.add(webapp_btn)
    markup.row(btn_new)
    markup.row(btn_vip, btn_free)
    markup.row(btn_storage, btn_support)
    return markup


# ==========================================
# 3. COMMAND HANDLERS / معالجات الأوامر
# ==========================================
@bot.message_handler(commands=['start'])
def handle_start(message):
    first_name = message.from_user.first_name or "صديقنا"
    welcome_text = (
        f"👋 <b>أهلاً وسهلاً بك يا {first_name} في منصة 𝔼𝕋𝔼𝔹𝕆𝕏𝕍𝕀ℙ الرسمية!</b>\n\n"
        f"🎥 المنصة الرائدة لمكتبة الفيديوهات، التخزين السحابي والخدمات الحصرية.\n\n"
        f"✨ <b>يمكنك الآن فتح التطبيق الكامل مباشرة داخل تيليجرام</b> "
        f"بالضغط على الزر أدناه 👇"
    )

    try:
        menu_button = types.MenuButtonWebApp(
            type="web_app",
            text="🎬 ETEBOX VIP",
            web_app=types.WebAppInfo(url=WEBAPP_URL)
        )
        bot.set_chat_menu_button(chat_id=message.chat.id, menu_button=menu_button)
    except Exception as e:
        print(f"Notice: Menu button setup: {e}")

    bot.send_message(
        chat_id=message.chat.id,
        text=welcome_text,
        reply_markup=get_main_inline_keyboard(),
        disable_web_page_preview=True
    )


@bot.message_handler(commands=['app', 'webapp', 'open'])
def handle_open_webapp(message):
    markup = types.InlineKeyboardMarkup()
    markup.add(
        types.InlineKeyboardButton(
            text="🚀 تشغيل تطبيق ETEBOX VIP الآن",
            web_app=types.WebAppInfo(url=WEBAPP_URL)
        )
    )
    bot.send_message(
        chat_id=message.chat.id,
        text="اضغط على الزر أدناه لتشغيل المنصة مباشرة داخل تيليجرام:",
        reply_markup=markup
    )


@bot.message_handler(commands=['links', 'new'])
def handle_links(message):
    text = (
        "📌 <b>الروابط الرسمية المعتمدة لـ ETEBOX VIP:</b>\n\n"
        f"✨ <b>WELCOME 2026:</b>\n{NEWEST_LINK_URL}\n\n"
        f"💎 <b>VIP Store:</b>\n{VIP_STORE_URL}\n\n"
        f"🎬 <b>Free Channel:</b>\n{FREE_VIDEOS_URL}\n\n"
        f"☁️ <b>Cloud Storage:</b>\n{STORAGE_URL}\n\n"
        f"🌐 <b>التطبيق التفاعلي:</b>\n{WEBAPP_URL}"
    )
    bot.send_message(
        chat_id=message.chat.id,
        text=text,
        reply_markup=get_main_inline_keyboard(),
        disable_web_page_preview=True
    )


@bot.message_handler(func=lambda msg: True)
def handle_text_messages(message):
    text = message.text or ""
    if "الروابط" in text or "Links" in text:
        handle_links(message)
    elif "مساعدة" in text or "Help" in text:
        bot.send_message(
            chat_id=message.chat.id,
            text=f"للحصول على مساعدة فورية يرجى التواصل مع الدعم: {SUPPORT_URL}",
            reply_markup=get_main_inline_keyboard()
        )
    else:
        bot.send_message(
            chat_id=message.chat.id,
            text="اضغط أدناه لفتح منصة ETEBOX VIP التفاعلية:",
            reply_markup=get_main_inline_keyboard()
        )


if __name__ == "__main__":
    print("==================================================")
    print(" ETEBOX VIP Telegram Bot is running successfully!")
    print(f" WebApp Destination: {WEBAPP_URL}")
    print("==================================================")
    bot.infinity_polling(skip_pending=True)
