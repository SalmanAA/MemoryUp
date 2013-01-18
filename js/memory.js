/**
 * 記憶ゲームクラス
 */
(function(ns) {

    ns.NEXT_GAME_FRAME = 90;

    ns.Memory = tm.createClass({

        // 何問前の回答を答えるか
        back : 0,

        // 問題のスタック
        quest : {},

        // 現在の問題数目
        current_quest_number : 0,

        // 現在のユーザの回答番号
        current_user_answer : 0,

        // 一つ前のユーザ回答番号
        past_user_answer : 0,

        // ユーザの回答履歴
        user_answer : [],

        // 正解数
        sum_result : 0,

        // フレーム数のカウンタ
        count : 0,

        // ゲームがスタートしたか
        flagStartGame : false,

        // 一度だけ実行できる関数を作る
        once : {},

        init : function(_back) {

            // 何問前の回答を答えるか
            this.back = _back || 1;

            // テキスト
            this.drawedNum = tm.app.Label("asdasdfasdfasdff"); // 生成
            this.drawedNum.x = 25; // X軸
            this.drawedNum.y = 50; // Y軸
            this.drawedNum.width = 200; // 幅
            ns.app.currentScene.addChild(this.drawedNum); // シーンに追加

            // 問題を管理するクラスの生成
            this.quest = ns.QuestNumber(ns.BACK_NUMBER);

            // カウンターの初期化
            this.initCount();

            this.once = ns.Once();
        },

        // カウンターの初期化
        initCount : function () {
            this.count = 0;
        },

        // クリックした場所の取得
        getClickPosition : function() {
            ns.app.pointing.getPointingEnd();
            return ns.app.pointing;
        },

        // クリックしたかを返す
        isClick : function () {
            return ns.app.pointing.getPointingEnd();
        },

        // カウントアップ
        countUp : function () {
            ++this.count;
        },

        getCount : function () {
            return this.count;
        },

        // 何問目を出題するかの計算(フレームから算出する)
        howManyQuest : function () {
            return parseInt(this.getCount() / ns.NEXT_GAME_FRAME);
        },

        // 次の問題に以降してよいか判断する
        isNextQuest : function () {
            if (this.getCount() % ns.NEXT_GAME_FRAME === 0) {
                return true;
            }
            return false;
        },

        // 問題を表示
        drawQuest : function(label) {
            label.text = this.quest.getQuest(this.howManyQuest());
        },

        // ゲームがスタートできるフレーム数に達したかを判断する
        isStartGame : function () {
            if (this.getCount() > (this.back * ns.NEXT_GAME_FRAME)) {
                return true;
            }
            return false;
        },

        // ユーザの回答をセット
        setUserAnswer : function (number) {
            this.user_answer[this.user_answer.length] = number;
        },

        // ユーザの現在の回答をゲット
        setCurrentUserAnswer : function () {
            // クリックされていなかったら以下処理を行わない
            if (this.isClick() === false) {
                return false;
            }

            this.past_user_answer    = this.current_user_answer;
            this.current_user_answer = this.getUserAnswer() || this.current_user_answer;

            return true;
        },

        // ユーザの過去の回答をゲット
        getPastUserAnswer : function () {
            return this.past_user_answer;
        },

        // 次の問題へ移行する
        nextQuest : function () {
            ++this.current_quest_number;

            // 過去入力分の暗転画像を元に戻す
            // @todo past_user_answer
        },


        // 全ての問題が終了したか
        finishQuest : function () {
            if (this.current_quest_number >= ns.QUESTNUM - 1 + this.back) {
                return true;
            }
            return false;
        },

        // ユーザの入力を取得
        getUserAnswer : function () {
            // クリックされていなかったら以下処理を行わない
            if (this.isClick() === false) {
                return false;
            }

            // クリック位置取得
            var mouse_position = this.getClickPosition();

            // クリックした場所がボタンの場所でなかったら終了する
            if (mouse_position.y < ns.BUTTON_Y) {
                return false;
            }

            // ボタンのサイズ
            var button_size = {
                x : ns.SCREEN_WIDTH  / 3,
                y : ns.SCREEN_WIDTH  / 3
            };

            var click_number_x = mouse_position.x                 / button_size.x | 0; // 横3列
            var click_number_y = (mouse_position.y - ns.BUTTON_Y) / button_size.y | 0; // 縦3列

            // どのボタンを押したのか判断する
            var user_answer = 0;
            if (click_number_x === 0 && click_number_y === 0) { user_answer = 1; }
            if (click_number_x === 0 && click_number_y === 1) { user_answer = 2; }
            if (click_number_x === 0 && click_number_y === 2) { user_answer = 3; }
            if (click_number_x === 1 && click_number_y === 0) { user_answer = 4; }
            if (click_number_x === 1 && click_number_y === 1) { user_answer = 5; }
            if (click_number_x === 1 && click_number_y === 2) { user_answer = 6; }
            if (click_number_x === 2 && click_number_y === 0) { user_answer = 7; }
            if (click_number_x === 2 && click_number_y === 1) { user_answer = 8; }
            if (click_number_x === 2 && click_number_y === 2) { user_answer = 9; }

            return user_answer;
        },

        // ボタンを全て明転する
        changeButtonRight : function (scene, sprites) {
            for (var i = 0; i < sprites.number_black.length; ++i) {
                scene.removeChild(sprites.number_black[i]);
            }
            for (var i = 0; i < sprites.number.length; ++i) {
                scene.removeChild(sprites.number[i]);
            }

            for (var i = 0; i < sprites.number.length; ++i) {
                scene.addChild(sprites.number[i]);
            }
        },

        // ボタンを全て暗転する
        changeButtonDark : function (scene, sprites) {
            for (var i = 0; i < sprites.number_black.length; ++i) {
                scene.removeChild(sprites.number_black[i]);
            }
            for (var i = 0; i < sprites.number.length; ++i) {
                scene.removeChild(sprites.number[i]);
            }

            for (var i = 0; i < sprites.number.length; ++i) {
                scene.addChild(sprites.number_black[i]);
            }
        },

        // ユーザの入力を取得２
        getUserAnswer2 : function (sprite) {
            // クリックされていなかったら以下処理を行わない
            if (this.isClick() === false) {
                return -1;
            }

            // クリック位置取得
            var mouse_position = this.getClickPosition();

            // スプライトとマウスのクリック位置が衝突したかを判定
            for (var i = 0; i < sprite.number.length; ++i) {
                if (sprite.number[i].isHitPoint(mouse_position.x, mouse_position.y)) {
                    return i;
                }
            }
            for (var i = 0; i < sprite.number_black.length; ++i) {
                if (sprite.number_black[i].isHitPoint(mouse_position.x, mouse_position.y)) {
                    return i;
                }
            }

            return -1;
        },

        // ゲームメイン処理
        update : function (scene) {

            // 問題が全て終了したら
            if (this.finishQuest()) {
                return true;
            }

            // ユーザが覚える問題数目までゲームはスタートしない
            if (this.isStartGame()) {
                // ユーザの入力箇所をセット
                this.setCurrentUserAnswer();

                // 一度だけボタンを全て明転する(以降この処理は行われない)

                this.once.run(true, this.changeButtonRight, scene, scene.sprite);

                // 次の問題に以降する
                if (this.isNextQuest()) {
                    // 入力した場所を保持する
                    this.setUserAnswer(this.current_user_answer);

                    // 次の問題へ以降する
                    this.nextQuest();

                    // 前問で入力していた箇所をリセットする
                    this.current_user_answer = 0;
                    this.past_user_answer = 0;

                    // ボタンを全て明転する
                    this.changeButtonRight(scene, scene.sprite);
                }
            }

            // カウントアップ
            this.countUp();

            return false;


        }

    });

})(game);