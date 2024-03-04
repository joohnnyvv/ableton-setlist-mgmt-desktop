
# Ableton Live Setlist Manager (Desktop)


The Ableton Live Setlist Manager is a user-friendly application designed to help musicians, DJs, and performers efficiently manage their setlists within Ableton Live. This app aims to simplify the process of organizing and navigating through your performance, offering essential features to enhance your live shows.


## Features

- **Seamless Integration**: Effortlessly import your Ableton Live markers ensuring perfect synchronization between the app and your Ableton Live set.

- **Intuitive Setlist Creation**: Create and arrange setlists with ease, allowing you to sequence songs in the desired order for a smooth performance flow.

- **Playback Control**: Control playback directly from the app, eliminating the need to switch between Ableton Live and other tools.

- **Flexible Stop-On-Finish Option**: Choose whether each song stops automatically after completion or seamlessly transitions to the next, providing a versatile approach to your performance dynamics.


## Getting Started

- Install the Ableton Live Setlist Manager app on your device.
- Run a [server](https://github.com/joohnnyvv/setlist-mgmt-server) to communicate with Ableton Live 
- Organize your setlist by drag-and-drop functionality by arranging songs to create your performance sequence.
- You can decide if you want to stop the set after the song is over by clicking the icon on the right side.
- Experience a streamlined setlist management process during your live performances.
- 
## Requirements

- Ableton Live installed.
- [ableton-js](https://github.com/leolabs/ableton-js) remote scripts added. You can find instructions on how to configure the ableton-js library in its repository.
- Device with the Ableton Live Setlist Manager app
  
## Run Locally

Follow these steps to get the setlist management app up and running on your local machine:

1. **Clone the Repository:**
  
        git clone https://github.com/joohnnyvv/ableton-setlist-mgmt-desktop.git
  

2. **Clone and Configure [Server Repository](https://github.com/joohnnyvv/setlist-mgmt-server)**

3. **Install Dependencies:**
  
        npm install
  

4. **Run the [Server](https://github.com/joohnnyvv/setlist-mgmt-server)**

5. **Run the Application:**
  
        npm start
  

Now you have the setlist management app up and running locally. 


## Usage Instructions

- **Add cues in Ableton Live** - Add two markers to each song (one at the beginning and one at the end of the song).
- **Rename the final markers** - In order for the end markers to perform their function (be a reference point for the application on where the song ends), but not be visible in the UI, they must contain <end> tag
- **Decide what should happen after the song ends** - There is an icon next to each song, click on it to change Ableton Live's behavior when the song ends. No icon means that when you reach the final marker, the program will automatically jump to the next song in the set. The "stop" icon means that the project will stop and you must manually play next song
- **Change the order in the set** - Using the drag-and-drop functionality, change the order of the songs in your setlist
- **Start playing!** - Use the media buttons at the bottom to play/stop your project

## Contributing

Contributions to the Ableton Live Setlist Manager app are encouraged! Feel free to share feature suggestions, bug reports, or improvements by opening an issue or submitting a pull request.
