class CreatedDatabase < ActiveRecord::Migration
  def change
	create_table "dep_105", id: false, force: :cascade do |t|
		t.string  "dep_no", null: false
	    t.string  "name"
	    t.integer "last"
	end
	add_index :dep_105, :dep_no, unique: true

	create_table "winrate_105", id: false, force: :cascade do |t|
	    t.string  "dep"
	    t.string  "opponent"
	    t.integer "win"
	    t.integer "total"
	    t.decimal "win_rate"
	end
  end
end
