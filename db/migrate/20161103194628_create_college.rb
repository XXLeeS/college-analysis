class CreateCollege < ActiveRecord::Migration
  def change
    create_table :colleges, id: false, force: :cascade do |t|
    	t.string "college_no", null: false
    	t.string "name"
    end
    add_index :colleges, :college_no, unique: true
  end
end
