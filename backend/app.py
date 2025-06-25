from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import subprocess

app = Flask(__name__)
CORS(app)

poems = {
    "love": [
        "Love is a whisper in the night,\nA gentle hand, a soft delight.\nIt weaves through time, both old and new,\nA fire that burns forever true.\nWith every heartbeat, love will grow,\nThrough highs and lows, it still will flow.",
        "In your smile, I see my home,\nIn your arms, no need to roam.\nYour laughter paints the skies so blue,\nMy world begins and ends with you.\nEach moment shared, each word, each glance,\nFeels like a never-ending dance."
    ],
    "hope": [
        "Hope is the dawn after the night,\nA spark that turns the dark to light.\nIt lifts you when your spirit’s low,\nAnd helps your inner courage grow.\nThough storms may rage and skies turn grey,\nHope gently guides you on your way.",
        "Beneath the pain, beneath the fear,\nHope is the voice you always hear.\nIt sings a song of better days,\nAnd lights your soul with healing rays.\nNo matter how the winds may blow,\nHope stays with you through ebb and flow."
    ],
    "life": [
        "Life’s a journey, wild and free,\nA story written endlessly.\nWith twists and turns, and paths unknown,\nThrough joy and grief, we all have grown.\nThe sun will rise, the night will fade,\nIn every step, our truth is made.",
        "Moments pass like drifting sand,\nYet each one leaves a mark so grand.\nFrom first breath to the very end,\nLife is the song we learn to send.\nSo dance along and laugh out loud,\nYou’re meant to shine, to stand out proud."
    ],
    "friendship": [
        "Friendship is a sacred thread,\nIn every word that’s kindly said.\nA bond that time cannot erase,\nA light in every shadowed place.\nWhen skies are grey and hearts are sore,\nA friend will always give you more.",
        "In laughter loud or silence deep,\nTrue friends are those you choose to keep.\nThey see your soul, your highs, your lows,\nAnd still they stay through all life throws.\nA treasure rare, a gift divine,\nYour heart, their heart, forever twine."
    ],
    "growth": [
        "Growth begins with shattered ground,\nWith silent cries that make no sound.\nIt finds its way through pain and doubt,\nThrough every storm we ride throughout.\nLike flowers bloom in wind and rain,\nWe rise each time we fall in pain.",
        "Every scar, a tale of grace,\nEvery loss, a warm embrace.\nYou stretch beyond the past you knew,\nBecoming stronger, bold, and true.\nSo trust the path that calls your name,\nEach step you take, you're not the same."
    ],
    "dreams": [
        "Chase the dreams that make you soar,\nBeyond the doubts, beyond the door.\nThe stars are closer than they seem,\nSo never shrink to fit a dream.\nLet courage lead, let passion guide,\nWith every fall, rise twice with pride.",
        "Dreams are seeds in hidden land,\nThey bloom with time, with heart, with hand.\nDon’t fear the dark, don’t fear the climb,\nYour dreams are blooming, right on time.\nHold fast to hope, believe your way,\nYour dreams will greet the light of day."
    ],
    "strength": [
        "Strength is not the loudest roar,\nBut rising when you hit the floor.\nIt's holding on when hope is thin,\nAnd finding power deep within.\nThrough broken days and sleepless nights,\nYou carry on, you keep the fight.",
        "You're braver than you even know,\nA fire beneath the silent glow.\nEach tear you’ve shed, each mountain climbed,\nTells of your courage, so refined.\nSo wear your scars with quiet pride,\nThey speak of strength you hold inside."
    ],
    "peace": [
        "Peace is not a place we find,\nIt lives within a quiet mind.\nIn stillness where the heart can rest,\nAnd worries float with gentle jest.\nBreathe in the calm, let chaos go,\nFeel sunlight in your soul’s soft glow.",
        "Among the trees, beneath the stars,\nPeace will mend your inner scars.\nNot in the noise, but in the hush,\nIn moonlight’s kiss and morning’s blush.\nLet go the weight, release the pain,\nAnd peace will wash you clean again."
    ],
    "positivity": [
        "Let kindness bloom in all you do,\nYour light will always carry through.\nA smile can start a world anew,\nAnd sunshine hides inside of you.\nWhen days are dim, just let it show—\nYour soul was made to brightly glow.",
        "You radiate with colors bright,\nAnd even storms can't dim your light.\nEach laugh you share, each word you say,\nCan turn a dark and weary day.\nSo spread the joy, don’t hold it tight,\nThe world needs more of your delight."
    ],
    "self-love": [
        "Look in the mirror, gently see\nA soul who’s growing, wild and free.\nYou are enough, you are complete,\nWith every flaw, you're still so sweet.\nSelf-love is quiet, calm, and true,\nIt always lives inside of you.",
        "Forgive yourself for what has been,\nFor healing starts from deep within.\nBe patient, kind, take up your space,\nThis life is yours, there’s no real race.\nIn every breath, choose grace and light,\nYou are your home, your truest right."
    ],
    "nature": [
        "The wind it hums a lullaby,\nThe trees reach gently to the sky.\nThe river sings, the mountains stand,\nAll life flows from the earth’s own hand.\nIn nature’s arms, we find our peace,\nA quiet place where worries cease.",
        "Let rain kiss skin and sun warm soul,\nLet forests make your spirit whole.\nIn flower’s bloom and ocean’s roar,\nWe learn to live, to love, and more.\nThe earth is old, yet always new,\nAnd every leaf speaks truths to you."
    ],
    "magic": [
        "Magic isn’t just in spells,\nIt lives in stars and wishing wells.\nIn how you laugh, in dreams you spin,\nIn every fire you hold within.\nIt’s in your heart, your voice, your eyes,\nA hidden truth in sweet disguise.",
        "You hold a spark the world can’t steal,\nA glow that’s vibrant, bold, and real.\nSo make your wish, and leap with grace,\nThe magic’s here, it fills this space.\nBelieve in all you’ve yet to see,\nFor magic’s born inside of thee."
    ]
}

@app.route("/start-bot", methods=["POST"])
def start_bot():
    try:
        subprocess.Popen([
            r"C:\Users\Iniya\AppData\Local\Programs\UiPath\Studio\UiRobot.exe",
            "execute",
            "--file",
            r"C:\Users\Iniya\OneDrive\Documents\UiPath\poem\Packages\poem.1.0.3.nupkg",
            "--input", '{"in_Name": "Iniya", "in_Theme": "hope"}'
        ])
        return jsonify({"status": "Bot started"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/generate", methods=["POST"])
def generate_poem():
    data = request.get_json()
    name = data.get("name", "Friend")
    theme = data.get("theme", "life").lower()

    if theme not in poems:
        return jsonify({"poem": [f"Sorry {name}, I don't have a poem for '{theme}' yet!"]})

    options = random.sample(poems[theme], min(len(poems[theme]), 2))
    final_poems = [f"{poem}\n\n" for poem in options]

    return jsonify({"poem": final_poems})

if __name__ == "__main__":
    app.run(debug=True)
