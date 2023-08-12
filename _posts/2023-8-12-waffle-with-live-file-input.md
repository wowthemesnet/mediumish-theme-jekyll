---
layout: post
title:  "Waffle file storage with live_file_input"
author: padma
categories: [ liveview, elixir, waffle ]
image: assets/images/18.png
description: "Getting user input in a liveview page with live_file_input or uploads and storing the file with waffle"
---

### Waffle
It is a file upload library for elixir with integrations for Amazon S3 as well. I wanted to integrate it into my project whereby I would take user input and store the file locally through a liveview page. Since I was using liveview I used [uploads](https://hexdocs.pm/phoenix_live_view/uploads.html). But I had problem regarding how exactly do I implement the storing of file. I was lost for a while. But I found out the way to make it work.

You are reading this blog so I assume you know about  [waffle](https://github.com/elixir-waffle/waffle). If you don't just read the docs and get it set up easily. And also get the [uploads](https://hexdocs.pm/phoenix_live_view/uploads.html) set up in your liveview page. I set up the uploads in my component which is basically called inside a modal as it is in charge to get user input.

```elixir
    #MyappWeb.Assignment.SupportFileComponent.ex 
    @impl true
      def mount(socket) do
        {:ok,
         socket
         |> assign(:uploaded_files, [])
         |> allow_upload(:support_file,
           accept: :any,
           max_entries: 1,
           max_file_size: 1_500_000
         )}
      end

	  @impl true
	  def render(assigns) do
	    ~H"""
	    <div>
	      <.header><%= @title %></.header>

	      <.simple_form
	        for={@form}
	        id="support_file-form"
	        phx-target={@myself}
	        phx-submit="save"
	        phx-change="validate"
	      >
	        <.label>Upload support file</.label>
	        <.live_file_input upload={@uploads.support_file} />
	        <:actions>
	          <.button>
	            Save support file
	          </.button>
	          <.link patch={@patch}>
	            Cancel
	          </.link>
	        </:actions>
	      </.simple_form>
	    </div>
	    """
	  end

	#in our save event handler
	@impl true
	  def handle_event("save", _params, socket) do
	    uploaded_files =
	      consume_uploaded_entries(socket, :support_file, fn meta, entry ->
	        {:ok, support_file} =
	        #AssignmentTests is my context
	        #create_support_file/1 is a function that expects a map and pipes it through changeset
	          AssignmentTests.create_support_file(%{
	            "file" => %Plug.Upload{
	              content_type: entry.client_type,
	              filename: entry.client_name,
	              path: meta.path
	            },
	            "assignment_id" => socket.assigns.assignment.id
	          })

	        Myapp.SupportFileUploader.url({support_file.file, support_file}, :original)
	        {:ok, support_file}
	      end)

	    {:noreply,
	     update(socket, :uploaded_files, &(&1 ++ uploaded_files))
	     |> put_flash(:info, "Support file created successfully")
	     |> push_patch(to: socket.assigns.patch)}
	  end
	
  
```
Here the Myapp.SupportFileUploader is the avatar file created with waffle which has necessary functions for such uploads. And the files are saved in ```/uploads``` by default



I made this small tutorial for those who have dealt with problem similar to mine. I hope this was helpful.