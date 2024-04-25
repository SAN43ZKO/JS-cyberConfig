const sqlite3 = require("sqlite3").verbose();
const api = require("./api.js");

//Create a new database
const db = new sqlite3.Database("./db.sqlite3", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to the database.");
  }
});


//Create table "commandsGroup"
async function createTableCommandGroup() {
  await db.run(`CREATE TABLE IF NOT EXISTS commandsGroup (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nameGroup TEXT NOT NULL
    )`);
}
createTableCommandGroup();


// //Insert into "commandsGroup" table
async function insertToCommandGroup() {
  const insert_quary = `INSERT INTO commandsGroup (nameGroup) VALUES 
    ("mouse"),
    ("video"),
    ("hud"),
    ("radar"),
    ("audio"),
    ("music"),
    ("viewmodel"),
    ("misc")`;
  db.run(insert_quary);
}
// insertToCommandGroup();


//Create table "commands"
async function createTableCommands() {
  await db.run(`CREATE TABLE IF NOT EXISTS commands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        command TEXT NOT NULL,
        type TEXT CHECK ( type IN ("boolean", "number", "string")) NOT NULL DEFAULT 'number',
        defaultvalue TEXT NOT NULL,
        group_id INTEGER NOT NULL,
        FOREIGN KEY (group_id) REFERENCES commandsGroup (id)
    )`);
}
createTableCommands();


// //Insert into "commands" table
async function insertTableCommands() {
  const insert_quary_commands = `INSERT INTO commands (command, group_id, type, defaultvalue) VALUES 
    ("sensitivity", 1, "number", "1"),
    ("zoom_sensitivity_ratio", 1, "number", "1"),
    ("cl_debounce_zoom", 1, "boolean", "0"),
    ("m_pitch", 1, "number", "0.022"),
    ("m_yaw", 1, "number", "0.022"),
    ("r_fullscreen_gamma", 2, "number", "2.4"),
    ("fps_max", 2, "number", "400"),
    ("fps_max_ui", 2, "number", "400"),
    ("hud_scaling", 3, "number", "1"),
    ("hud_showtargetid", 3, "boolean", "0"),
    ("cl_hud_color", 3, "number", "1"),
    ("cl_allow_animated_avatars", 3, "boolean", "0"),
    ("cl_show_observer_crosshair", 3, "number", "2"),
    ("cl_teammate_colors_show", 3, "boolean", "1"),
    ("cl_draw_only_deathnotices", 3, "boolean", "0"),
    ("cl_teamid_overhead_mode", 3, "number", "2"),
    ("cl_showloadout", 3, "boolean", "1"),
    ("cl_showfps", 3, "boolean", "0"),
    ("cl_hud_radar_scale", 4, "number", "1.3"),
    ("cl_radar_always_centered", 4, "boolean","0"),
    ("cl_radar_scale", 4, "number", "0.3"),
    ("cl_radar_icon_scale_min", 4, "number", "0.45"),
    ("cl_radar_rotate", 4, "boolean", "1"),
    ("cl_radar_square_with_scoreboard", 4, "boolean", "1"),
    ("volume", 5, "number", "0.1"),
    ("voice_modenable", 5, "boolean", "1"),
    ("snd_voipvolume", 5, "number", "0.5"),
    ("snd_headphone_eq", 5, "number", "1"),
    ("snd_steamaudio_enable_perspective_correction", 5, "boolean", "0"),
    ("snd_spatialize_lerp", 5, "number", "0.5"),
    ("snd_mute_losefocus", 5, "boolean", "0"),
    ("snd_mute_mvp_music_live_players", 6, "boolean", "1"),
    ("snd_menumusic_volume", 6, "number", "0"),
    ("snd_roundstart_volume", 6, "number", "0"),
    ("snd_roundaction_volume", 6, "number", "0"),
    ("snd_roundend_volume", 6, "number", "0"),
    ("snd_mvp_volume", 6, "number", "0"),
    ("snd_tensecondwarning_volume", 6, "number", "0"),
    ("snd_mapobjective_volume", 6, "number", "0"),
    ("snd_deathcamera_volume", 6, "number", "0"),
    ("viewmodel_fov", 7, "number", "68"),
    ("viewmodel_offset_x", 7, "number", "2.5"),
    ("viewmodel_offset_y", 7, "number", "0"),
    ("viewmodel_offset_z", 7, "number", "-1.5"),
    ("viewmodel_presetpos", 7, "number", "3"),
    ("player_nevershow_communityservermessage", 8, "boolean", "1"),
    ("cl_mute_enemy_team", 8, "boolean", "0"),
    ("gameinstructor_enable", 8, "boolean", "0"),
    ("cl_join_advertise", 8, "number", "2"),
    ("cl_autohelp", 8, "boolean", "0"),
    ("cl_use_opens_buy_menu", 8, "boolean", "0"),
    ("cl_sniper_delay_unscope", 8, "boolean", "0"),
    ("cl_sniper_auto_rezoom", 8, "boolean", "1"),
    ("cl_crosshair_sniper_width", 8, "number", "1"),
    ("cl_silencer_mode", 8, "number", "0"),
    ("cl_buywheel_donate_key", 8, "number", "0"),
    ("cl_playerspray_auto_apply", 8, "number", "0")
    `;
  db.run(insert_quary_commands);
}
// insertTableCommands();


//Select data
async function selectData() {
  db.all(
    "SELECT nameGroup, command, defaultValue, type FROM commands INNER JOIN commandsGroup ON commandsGroup.id = commands.group_id",
    (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      const result = {};
      for (const item of rows) {
        if (result[item.nameGroup]) {
          result[item.nameGroup].commands.push({
            name: item.command,
            defaultValue: item.defaultvalue,
            type: item.type,
          });
          continue;
        }
        result[item.nameGroup] = {
          commands: [
            {
              name: item.command,
              defaultValue: item.defaultvalue,
              type: item.type,
            },
          ],
        };
      }
      api.getJsonResponse();
      exports.resultJson = result;
    }
  );
}
selectData();
