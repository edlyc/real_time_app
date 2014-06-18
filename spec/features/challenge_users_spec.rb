require "spec_helper"

describe "Challenge Users" do
  before { visit root_path }
  subject { page }

  describe "Joining the Lobby", js: true do
    before do
      fill_in "screen_name", with: "Some Username"
      click_button "Submit"
    end

    it { should have_content "Some Username" }
  end
end