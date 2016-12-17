# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20161217062956) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "colleges", id: false, force: :cascade do |t|
    t.string "college_no", null: false
    t.string "name"
  end

  add_index "colleges", ["college_no"], name: "index_colleges_on_college_no", unique: true, using: :btree

  create_table "dep_105", id: false, force: :cascade do |t|
    t.string  "dep_no",      null: false
    t.string  "name"
    t.integer "last"
    t.integer "lowest"
    t.integer "field"
    t.string  "college_no"
    t.integer "level"
    t.decimal "ts_rscore"
    t.decimal "ts_mu"
    t.decimal "ts_sigma"
    t.integer "max_num"
    t.integer "waiting_num"
    t.integer "real_num"
    t.decimal "predict_num"
  end

  add_index "dep_105", ["dep_no"], name: "index_dep_105_on_dep_no", unique: true, using: :btree

  create_table "link_105", id: false, force: :cascade do |t|
    t.string  "source"
    t.string  "target"
    t.integer "value"
  end

  create_table "winrate_105", id: false, force: :cascade do |t|
    t.string  "dep"
    t.string  "opponent"
    t.integer "win"
    t.integer "total"
    t.decimal "win_rate"
  end

end
