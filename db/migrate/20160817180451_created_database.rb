class CreatedDatabase < ActiveRecord::Migration
  def change
	  create_table "dep_105", primary_key: "dep_no", force: :cascade do |t|
	    t.string  "name"
	    t.integer "last"
	  end

	  create_table "winrate_105", id: false, force: :cascade do |t|
	    t.string  "dep",      limit: 6, null: false
	    t.string  "opponent", limit: 6, null: false
	    t.integer "win"
	    t.integer "total"
	    t.decimal "win_rate"
	  end
  end
end
